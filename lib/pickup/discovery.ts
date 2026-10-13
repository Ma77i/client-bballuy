import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../backend/database.types';
import { capacities, pickupFormats, type PickupFormat } from './organizer.ts';

type CatalogRow = Omit<Database['public']['Views']['pickup_session_catalog']['Row'], 'created_at' | 'closed_at'>;
type RosterRow = Omit<Database['public']['Views']['pickup_roster']['Row'], 'joined_at'>;
export type PublicSession = {
  id: string; court_id: string; organizer_id: string; organizer_name: string;
  format: PickupFormat; capacity: number; occupied_places: number; available_places: number;
  timing: 'now' | 'future'; scheduled_at: string; started_at: string | null;
  state: 'open' | 'started' | 'cancelled' | 'completed';
  description: string; organizer_plays: boolean;
};
export type PublicPlace = { id: string; session_id: string; user_id: string | null; name: string; guest: boolean };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const publicSessionColumns = 'id,court_id,organizer_id,organizer_name,format,capacity,occupied_places,available_places,timing,scheduled_at,started_at,state,description,organizer_plays';
const rosterColumns = 'id,session_id,user_id,display_name,guest_label';
const validId = (value: unknown): value is string => typeof value === 'string' && uuid.test(value);
const validDate = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));

export function publicSession(row: CatalogRow): PublicSession {
  const format = pickupFormats.find(value => value === row.format);
  const state = (['open', 'started', 'cancelled', 'completed'] as const).find(value => value === row.state);
  if (!validId(row.id) || !validId(row.court_id) || !validId(row.organizer_id) || !format || !state ||
      !['now', 'future'].includes(row.timing ?? '') || !validDate(row.scheduled_at) ||
      (row.started_at !== null && !validDate(row.started_at)) || (state === 'started' && !row.started_at) ||
      row.capacity !== capacities[format] || !Number.isInteger(row.occupied_places) || row.occupied_places === null ||
      row.occupied_places < 0 || row.occupied_places > row.capacity || row.available_places !== row.capacity - row.occupied_places ||
      typeof row.organizer_plays !== 'boolean' || typeof row.description !== 'string') {
    throw new Error('Unable to read valid game details. Refresh to try again.');
  }
  return { id: row.id, court_id: row.court_id, organizer_id: row.organizer_id,
    organizer_name: row.organizer_name?.trim() || 'Organizer', format, state,
    capacity: row.capacity, occupied_places: row.occupied_places, available_places: row.available_places,
    timing: row.timing as PublicSession['timing'], scheduled_at: row.scheduled_at, started_at: row.started_at,
    description: row.description, organizer_plays: row.organizer_plays };
}

export function publicRoster(rows: RosterRow[], sessionId: string): PublicPlace[] {
  const seen = new Set<string>(), users = new Set<string>();
  return rows.map(row => {
    const guest = row.user_id === null;
    if (!validId(row.id) || row.session_id !== sessionId || seen.has(row.id) ||
        (guest ? !row.guest_label?.trim() : !validId(row.user_id) || row.guest_label !== null || users.has(row.user_id))) {
      throw new Error('Unable to read valid player places. Refresh to try again.');
    }
    seen.add(row.id);
    if (row.user_id) users.add(row.user_id);
    return { id: row.id, session_id: sessionId, user_id: row.user_id,
      name: row.display_name?.trim() || row.guest_label?.trim() || 'Player', guest };
  });
}

export function sessionGroups(rows: PublicSession[], now = Date.now()) {
  return {
    immediate: rows.filter(row => row.state === 'open' && row.timing === 'now'),
    upcoming: rows.filter(row => row.state === 'open' && row.timing === 'future' && Date.parse(row.scheduled_at) > now),
    playing: rows.filter(row => row.state === 'started').sort((a, b) => Date.parse(b.started_at!) - Date.parse(a.started_at!)),
  };
}
export function scheduledLabel(game: PublicSession, now = Date.now()) {
  if (game.state === 'started') return `Started ${dateLabel(game.started_at!)}`;
  if (game.timing === 'now') return 'Immediate invitation';
  return `${Date.parse(game.scheduled_at) <= now && game.state === 'open' ? 'Planned time has passed · ' : ''}${dateLabel(game.scheduled_at)}`;
}
export function dateLabel(value: string | number) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}
export async function checkPickupReader(client: SupabaseClient<Database>, owner: string) {
  if (!validId(owner)) throw new Error('Sign in to view games.');
  const { data, error } = await client.auth.getUser();
  if (error || data.user?.id !== owner) throw new Error('Unable to confirm your session. Sign in again or retry.');
}

export async function loadPublicSessions(client: SupabaseClient<Database>, owner: string, signal?: AbortSignal) {
  await checkPickupReader(client, owner);
  const rows: PublicSession[] = [], seen = new Set<string>();
  const pageSize = 500;
  for (let offset = 0; ; offset += pageSize) {
    let query = client.from('pickup_session_catalog').select(publicSessionColumns).in('state', ['open', 'started'])
      .order('scheduled_at').order('id').range(offset, offset + pageSize - 1);
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query;
    if (error) throw new Error('Unable to load games. Retry to check the latest activity.');
    for (const row of data ?? []) {
      const game = publicSession(row);
      // Changes during paging may move a row. The next refresh reconciles it.
      if (!seen.has(game.id)) { rows.push(game); seen.add(game.id); }
    }
    if ((data?.length ?? 0) < pageSize) break;
    if (signal?.aborted) throw new Error('Game loading was interrupted.');
  }
  await checkPickupReader(client, owner);
  return rows;
}

export async function loadPublicSession(client: SupabaseClient<Database>, owner: string, id: string, signal?: AbortSignal) {
  if (!validId(id)) throw new Error('Game not found.');
  await checkPickupReader(client, owner);
  let sessionQuery = client.from('pickup_session_catalog').select(publicSessionColumns).eq('id', id);
  let rosterQuery = client.from('pickup_roster').select(rosterColumns).eq('session_id', id).order('joined_at').order('id');
  if (signal) { sessionQuery = sessionQuery.abortSignal(signal); rosterQuery = rosterQuery.abortSignal(signal); }
  const [session, roster] = await Promise.all([sessionQuery.maybeSingle(), rosterQuery]);
  if (session.error || roster.error) throw new Error('Unable to load game details. Retry to check the latest state.');
  if (!session.data) throw new Error('Game not found or no longer available.');
  const game = publicSession(session.data), places = publicRoster(roster.data ?? [], id);
  await checkPickupReader(client, owner);
  // The two reads are not one snapshot. A new join may temporarily change counts.
  return { game, places, rosterChanged: game.occupied_places !== places.length };
}
