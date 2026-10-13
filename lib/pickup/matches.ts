import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '../backend/database.types';
import { checkPickupReader } from './discovery.ts';
import { capacities, pickupFormats, type PickupFormat } from './organizer.ts';

export type PlayerDraft = { side: 'A' | 'B'; kind: 'guest' | 'account'; label: string; userId: string };
export type MatchDraft = { courtId: string; format: PickupFormat; sourceId: string; players: PlayerDraft[] };
export type MatchInput = { action: 'create_match' | 'score'; data: { [key: string]: Json | undefined } };
export type Match = Database['public']['Tables']['pickup_matches']['Row'];
type Player = Database['public']['Views']['pickup_match_roster']['Row'];
type History = Database['public']['Tables']['pickup_score_history']['Row'];
export type MatchDetail = { game: Match; players: Player[]; history: History[] };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const columns = 'id,court_id,organizer_id,source_session_id,format,state,score_a,score_b,revision,created_at,closed_at';
const integer = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 2147483647;
const record = (n: unknown): n is Record<string, unknown> => typeof n === 'object' && n !== null && !Array.isArray(n);
export function matchPlayers(format: PickupFormat): PlayerDraft[] {
  return (['A', 'B'] as const).flatMap(side => Array.from({ length: capacities[format] / 2 }, () => ({ side, kind: 'guest' as const, label: '', userId: '' })));
}
export function validateMatchDraft(draft: MatchDraft) {
  const errors: Record<string, string> = {}, seen = new Set<string>();
  if (!uuid.test(draft.courtId)) errors.courtId = 'Choose a court.';
  if (!pickupFormats.includes(draft.format)) errors.format = 'Choose a supported format.';
  if (draft.sourceId && !uuid.test(draft.sourceId)) errors.sourceId = 'Invalid source invitation.';
  const count = capacities[draft.format] / 2;
  if (draft.players.length !== count * 2 || ['A', 'B'].some(side => draft.players.filter(p => p.side === side).length !== count)) errors.players = 'Fill both sides with the required number of players.';
  const players = draft.players.map((p, index) => {
    if (p.kind === 'account') {
      if (!uuid.test(p.userId) || seen.has(p.userId)) errors[`player${index}`] = 'Choose a different registered player.';
      seen.add(p.userId);
      return { side: p.side, user_id: p.userId };
    }
    if (p.kind !== 'guest' || !p.label.trim() || p.label.trim().length > 40) errors[`player${index}`] = 'Enter a guest name, 1–40 characters.';
    return { side: p.side, guest_label: p.label.trim() };
  });
  return { errors, input: { action: 'create_match', data: { court_id: draft.courtId, format: draft.format,
    players, ...(draft.sourceId ? { source_session_id: draft.sourceId } : {}) } } as MatchInput };
}
export function validateFinalScore(id: string, revision: number, a: string, b: string) {
  const errors: Record<string, string> = {};
  for (const [key, value] of [['scoreA', a], ['scoreB', b]]) if (!/^\d+$/.test(value) || !integer(Number(value))) errors[key] = 'Enter a non-negative whole number.';
  if (!uuid.test(id) || !integer(revision)) errors.match = 'Refresh the current result before saving.';
  return { errors, input: { action: 'score', data: { match_id: id, expected_revision: revision, score_a: Number(a), score_b: Number(b) } } as MatchInput };
}
export function validateMatch(row: Match): Match {
  if (![row.id, row.court_id, row.organizer_id].every(id => uuid.test(id)) || !pickupFormats.includes(row.format as PickupFormat) ||
      (row.source_session_id !== null && !uuid.test(row.source_session_id)) || !integer(row.revision) || !Number.isFinite(Date.parse(row.created_at)) ||
      (row.state === 'started' ? row.revision !== 0 || row.score_a !== null || row.score_b !== null || row.closed_at !== null :
        row.state !== 'completed' || row.revision < 1 || !integer(row.score_a) || !integer(row.score_b) || !row.closed_at || !Number.isFinite(Date.parse(row.closed_at)))) {
    throw new Error('Unable to read valid match information. Refresh to try again.');
  }
  return row;
}
async function loadScoreHistory(client: SupabaseClient<Database>, id: string, signal?: AbortSignal): Promise<History[]> {
  const rows: History[] = [];
  for (let offset = 0; ; offset += 500) {
    let query = client.from('pickup_score_history').select('match_id,revision,previous_a,previous_b,score_a,score_b,changed_at')
      .eq('match_id', id).order('revision').range(offset, offset + 499);
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query;
    if (error) throw new Error('Unable to load result history. Retry.');
    rows.push(...(data ?? []));
    if ((data?.length ?? 0) < 500) return rows;
  }
}
export async function loadMatch(client: SupabaseClient<Database>, owner: string, id: string, signal?: AbortSignal): Promise<MatchDetail> {
  if (!uuid.test(id)) throw new Error('Match not found.');
  await checkPickupReader(client, owner);
  let game = client.from('pickup_matches').select(columns).eq('id', id);
  let roster = client.from('pickup_match_roster').select('id,match_id,side,user_id,guest_label,display_name').eq('match_id', id).order('side').order('id');
  if (signal) { game = game.abortSignal(signal); roster = roster.abortSignal(signal); }
  const [g, p, changes] = await Promise.all([game.maybeSingle(), roster, loadScoreHistory(client, id, signal)]);
  if (g.error || p.error) throw new Error('Unable to load the match and result history. Retry.');
  if (!g.data) throw new Error('Match not found or no longer available.');
  const current = validateMatch(g.data), players = p.data ?? [];
  const count = capacities[current.format as PickupFormat] / 2, seen = new Set<string>(), ids = new Set<string>();
  if (players.length !== count * 2 || ['A', 'B'].some(side => players.filter(player => player.side === side).length !== count)) throw new Error('Player sides changed or are incomplete. Refresh.');
  for (const player of players) {
    if (!player.id || !uuid.test(player.id) || ids.has(player.id) || player.match_id !== id ||
        (player.user_id ? !uuid.test(player.user_id) || seen.has(player.user_id) || player.guest_label !== null : !player.guest_label?.trim())) throw new Error('Unable to read valid match players.');
    ids.add(player.id); if (player.user_id) seen.add(player.user_id);
  }
  if (changes.length !== current.revision || changes.some((change, index) => change.match_id !== id || change.revision !== index + 1 ||
      !integer(change.score_a) || !integer(change.score_b) || !Number.isFinite(Date.parse(change.changed_at)) ||
      (index === 0 ? change.previous_a !== null || change.previous_b !== null : change.previous_a !== changes[index - 1].score_a || change.previous_b !== changes[index - 1].score_b)) ||
      (current.revision > 0 && (changes.at(-1)?.score_a !== current.score_a || changes.at(-1)?.score_b !== current.score_b))) throw new Error('The result changed during this check. Refresh the match and history.');
  await checkPickupReader(client, owner);
  return { game: current, players, history: changes };
}
export async function loadOwnedMatches(client: SupabaseClient<Database>, owner: string, signal?: AbortSignal) {
  await checkPickupReader(client, owner);
  const rows: Match[] = [];
  for (let offset = 0; ; offset += 500) {
    let query = client.from('pickup_matches').select(columns).eq('organizer_id', owner).order('created_at', { ascending: false }).order('id').range(offset, offset + 499);
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query;
    if (error) throw new Error('Unable to load your recorded matches. Retry.');
    for (const row of data ?? []) { if (row.organizer_id !== owner) throw new Error('Your account changed. Retry.'); rows.push(validateMatch(row)); }
    if ((data?.length ?? 0) < 500) break;
  }
  await checkPickupReader(client, owner); return rows;
}
export async function searchMatchPlayers(client: SupabaseClient<Database>, owner: string, search: string, signal?: AbortSignal) {
  if (search.trim().length < 2 || search.trim().length > 40) return [];
  await checkPickupReader(client, owner);
  let query = client.rpc('pickup_player_search', { p_search: search.trim() });
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw new Error('Unable to find players. Retry the search.');
  if ((data ?? []).some(row => !uuid.test(row.id) || !row.display_name?.trim())) throw new Error('Unable to read player names.');
  await checkPickupReader(client, owner); return data ?? [];
}
export class MatchError extends Error {
  rejected: boolean;
  constructor(message: string, rejected = false) { super(message); this.rejected = rejected; }
}
type Pending = { owner: string; backend: string; scope: string; requestId: string; input: MatchInput };
type Storage = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void>; removeItem(key: string): Promise<void> };
export function createMatchManager(options: { client: SupabaseClient<Database>; storage: Storage; owner: string; backend: string; scope: string; makeId(): string }) {
  const { client, storage, owner, backend, scope, makeId } = options;
  const key = `pickup-match:${backend}:${owner}:${scope}`;
  let pending: Pending | null = null, inFlight: Promise<MatchDetail> | null = null;
  function valid(value: unknown): value is Pending {
    return record(value) && value.owner === owner && value.backend === backend && value.scope === scope && typeof value.requestId === 'string' && uuid.test(value.requestId) &&
      record(value.input) && record(value.input.data) && (scope === 'create' ? value.input.action === 'create_match' : value.input.action === 'score' && value.input.data.match_id === scope);
  }
  return {
    get pending() { return pending; }, get busy() { return Boolean(inFlight); },
    async load() {
      if (inFlight) return pending;
      const raw = await storage.getItem(key); pending = null;
      if (raw) { let value: unknown; try { value = JSON.parse(raw); } catch { value = null; }
        if (valid(value)) pending = value; else await storage.removeItem(key); }
      return pending;
    },
    send(input?: MatchInput) {
      if (inFlight) return inFlight;
      const task = (async () => {
        if (!pending) { if (!input) throw new MatchError('Choose an action first.'); pending = { owner, backend, scope, requestId: makeId(), input }; }
        const request = pending;
        try { await storage.setItem(key, JSON.stringify(request)); } catch { throw new MatchError('Unable to save this request on your device. Retry.'); }
        let result: MatchDetail;
        try {
          await checkPickupReader(client, owner);
          const { data, error } = await client.rpc('pickup_command', { p_request_id: request.requestId, p_expected_actor: owner,
            p_action: request.input.action, p_data: request.input.data });
          if (error) {
            if (error.code === 'PT409') throw new MatchError('The result or invitation changed. Refresh and review before saving again.', true);
            if (['22023','23505','23503','23514','P0002'].includes(error.code) || (error.code === '42501' && error.message === 'Organizer required')) throw new MatchError('This match cannot be saved with these choices. Review the players and invitation.', true);
            throw new MatchError('Unable to confirm the change. Retry the saved request.');
          }
          if (!record(data) || typeof data.id !== 'string' || !uuid.test(data.id) || (request.input.action === 'score' && data.id !== scope)) throw new MatchError('Unable to confirm the change. Retry the saved request.');
          try { result = await loadMatch(client, owner, data.id); if (result.game.organizer_id !== owner) throw new Error('Changed organizer'); }
          catch { throw new MatchError('Your change may be saved. Retry to confirm the current match and history.'); }
        } catch (error) {
          if (error instanceof MatchError && error.rejected) { try { await storage.removeItem(key); pending = null; } catch { /* Keep retry identity if cleanup fails. */ } }
          throw error;
        }
        try { await storage.removeItem(key); pending = null; } catch { throw new MatchError('Saved, but this device could not finish confirmation. Retry.'); }
        return result;
      })(); inFlight = task;
      void task.finally(() => { inFlight = null; }).catch(() => { /* The screen renders failures. */ }); return task;
    },
  };
}
