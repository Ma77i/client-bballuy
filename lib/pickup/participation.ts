import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../backend/database.types';
import { checkPickupReader, loadPublicSession, publicSession, publicSessionColumns, type PublicSession } from './discovery.ts';

type ParticipationAction = 'join' | 'leave';
type Storage = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void>; removeItem(key: string): Promise<void> };
type Pending = { owner: string; backend: string; sessionId: string; requestId: string; action: ParticipationAction };
type Detail = Awaited<ReturnType<typeof loadPublicSession>>;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export class ParticipationError extends Error {
  readonly rejected: boolean;
  constructor(message: string, rejected = false) { super(message); this.rejected = rejected; }
}
export function participationState(detail: Detail, owner: string) {
  const joined = detail.places.some(place => place.user_id === owner);
  return { joined, canJoin: detail.game.state === 'open' && !joined && detail.game.available_places > 0 && !detail.rosterChanged,
    canLeave: detail.game.state === 'open' && joined && !detail.rosterChanged };
}
export async function executeParticipation(client: SupabaseClient<Database>, pending: Pending) {
  if (![pending.owner, pending.sessionId, pending.requestId].every(id => uuid.test(id)) || !['join', 'leave'].includes(pending.action)) {
    throw new ParticipationError('Invalid registration request.', true);
  }
  await checkPickupReader(client, pending.owner);
  let receipt: unknown;
  try {
    const { data, error } = await client.rpc('pickup_command', { p_request_id: pending.requestId,
      p_expected_actor: pending.owner, p_action: pending.action, p_data: { session_id: pending.sessionId } });
    if (error) {
      if (error.code === 'PT409') throw new ParticipationError('Places or game status changed. Refresh before trying again.', true);
      if (['22023', 'P0002', '23503'].includes(error.code)) throw new ParticipationError('This invitation is unavailable. Refresh before trying again.', true);
      // Authentication, gateway and unknown failures may follow a previous uncertain write.
      throw new ParticipationError('Unable to confirm your registration change. Retry the saved request.');
    }
    receipt = data;
  } catch (error) {
    if (error instanceof ParticipationError) throw error;
    throw new ParticipationError('Unable to confirm your registration change. Retry the saved request.');
  }
  if (!receipt || typeof receipt !== 'object' || !('id' in receipt) || receipt.id !== pending.sessionId) {
    throw new ParticipationError('Unable to confirm your registration change. Retry the saved request.');
  }
  try {
    const detail = await loadPublicSession(client, pending.owner, pending.sessionId);
    if (detail.rosterChanged) throw new Error('Roster changed during readback');
    return detail;
  } catch {
    throw new ParticipationError('Your change may be saved. Retry to confirm your current place.');
  }
}
export function createParticipationManager(options: {
  client: SupabaseClient<Database>; storage: Storage; owner: string; backend: string; sessionId: string; makeId(): string;
}) {
  const { client, storage, owner, backend, sessionId, makeId } = options;
  const key = `pickup-participation:${backend}:${owner}:${sessionId}`;
  let pending: Pending | null = null;
  let inFlight: Promise<Detail> | null = null;
  function valid(value: unknown): value is Pending {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const item = value as Record<string, unknown>;
    return item.owner === owner && item.backend === backend && item.sessionId === sessionId &&
      typeof item.requestId === 'string' && uuid.test(item.requestId) && (item.action === 'join' || item.action === 'leave');
  }
  return {
    get pending() { return pending; },
    get busy() { return Boolean(inFlight); },
    async load() {
      if (inFlight) return pending;
      const raw = await storage.getItem(key);
      pending = null;
      if (raw) {
        let value: unknown;
        try { value = JSON.parse(raw); } catch { value = null; }
        if (valid(value)) pending = value;
        else await storage.removeItem(key);
      }
      return pending;
    },
    send(action?: ParticipationAction) {
      if (inFlight) return inFlight;
      const task = (async () => {
        if (!pending) {
          if (!action) throw new ParticipationError('Choose a registration action first.');
          pending = { owner, backend, sessionId, requestId: makeId(), action };
        }
        try { await storage.setItem(key, JSON.stringify(pending)); }
        catch { throw new ParticipationError('Unable to save this request on your device. Retry before continuing.'); }
        let detail: Detail;
        try { detail = await executeParticipation(client, pending); }
        catch (error) {
          if (error instanceof ParticipationError && error.rejected) {
            try { await storage.removeItem(key); pending = null; } catch { /* Preserve a request if cleanup fails. */ }
          }
          throw error;
        }
        try { await storage.removeItem(key); pending = null; }
        catch { throw new ParticipationError('Your place was checked, but this device could not finish confirmation. Retry.'); }
        return detail;
      })();
      inFlight = task;
      void task.finally(() => { inFlight = null; }).catch(() => { /* The screen handles the rejection. */ });
      return task;
    },
  };
}

export type PersonalSession = { game: PublicSession; organizing: boolean; joined: boolean };
export async function loadPersonalSessions(client: SupabaseClient<Database>, owner: string, signal?: AbortSignal): Promise<PersonalSession[]> {
  await checkPickupReader(client, owner);
  const games = new Map<string, PublicSession>(), joined = new Set<string>();
  const pageSize = 500;
  for (let offset = 0; ; offset += pageSize) {
    let query = client.from('pickup_session_catalog').select(publicSessionColumns).eq('organizer_id', owner)
      .order('id').range(offset, offset + pageSize - 1);
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query;
    if (error) throw new Error('Unable to load your sessions. Retry to check your registrations.');
    for (const row of data ?? []) {
      const game = publicSession(row);
      if (game.organizer_id !== owner) throw new Error('Unable to confirm your personal sessions.');
      games.set(game.id, game);
    }
    if ((data?.length ?? 0) < pageSize) break;
  }
  for (let offset = 0; ; offset += pageSize) {
    let query = client.from('pickup_roster').select('session_id,user_id').eq('user_id', owner)
      .order('session_id').order('id').range(offset, offset + pageSize - 1);
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query;
    if (error) throw new Error('Unable to load your sessions. Retry to check your registrations.');
    for (const place of data ?? []) {
      if (!place.session_id || !uuid.test(place.session_id) || place.user_id !== owner) throw new Error('Unable to confirm your personal sessions.');
      joined.add(place.session_id);
    }
    if ((data?.length ?? 0) < pageSize) break;
  }
  const missing = [...joined].filter(id => !games.has(id));
  for (let offset = 0; offset < missing.length; offset += 100) {
    let query = client.from('pickup_session_catalog').select(publicSessionColumns).in('id', missing.slice(offset, offset + 100));
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query;
    if (error) throw new Error('Unable to load your sessions. Retry to check your registrations.');
    for (const row of data ?? []) {
      const game = publicSession(row);
      if (!joined.has(game.id)) throw new Error('Unable to confirm your personal sessions.');
      games.set(game.id, game);
    }
  }
  if ([...joined].some(id => !games.has(id))) throw new Error('Your session list changed during this check. Refresh to reconcile it.');
  await checkPickupReader(client, owner);
  return [...games.values()].map(game => ({ game, organizing: game.organizer_id === owner, joined: joined.has(game.id) }))
    .sort((a, b) => Date.parse(a.game.scheduled_at) - Date.parse(b.game.scheduled_at));
}
