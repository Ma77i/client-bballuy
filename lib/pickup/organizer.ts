import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '../backend/database.types';

export const pickupFormats = ['1v1', '2v2', '5v5'] as const;
export type PickupFormat = typeof pickupFormats[number];
export const capacities: Record<PickupFormat, number> = { '1v1': 2, '2v2': 4, '5v5': 10 };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export type SessionDraft = {
  courtId: string; format: PickupFormat; timing: 'now' | 'future';
  date: string; time: string; organizerPlays: boolean; presentCount: string; description: string;
};
export type DraftErrors = Partial<Record<keyof SessionDraft, string>>;
export type OrganizerInput = {
  action: 'create_session' | 'edit_session' | 'start' | 'cancel' | 'complete_session';
  data: { [key: string]: Json | undefined };
};
export type OwnedSession = Omit<Database['public']['Tables']['pickup_sessions']['Row'], 'capacity'> & {
  capacity: number; occupied_places: number; available_places: number;
};
export class OrganizerError extends Error {
  uncertain: boolean;
  rejected: boolean;
  constructor(message: string, uncertain = false, rejected = false) { super(message); this.uncertain = uncertain; this.rejected = rejected; }
}

export function validateSessionDraft(draft: SessionDraft, now = new Date()) {
  const errors: DraftErrors = {};
  if (!uuid.test(draft.courtId)) errors.courtId = 'Choose a court.';
  if (!pickupFormats.includes(draft.format)) errors.format = 'Choose 1v1, 2v2 or 5v5.';
  if (!['now', 'future'].includes(draft.timing)) errors.timing = 'Choose when to play.';
  if (typeof draft.organizerPlays !== 'boolean') errors.organizerPlays = 'Choose whether you are playing.';
  if (draft.description.trim().length > 500) errors.description = 'Use 500 characters or fewer.';
  const present = draft.timing === 'future' ? Number(draft.organizerPlays) : Number(draft.presentCount);
  if ((draft.timing === 'now' && !/^\d+$/.test(draft.presentCount)) ||
    !Number.isSafeInteger(present) || present < Number(draft.organizerPlays) || present > capacities[draft.format]) {
    errors.presentCount = `Choose ${Number(draft.organizerPlays)}–${capacities[draft.format] ?? 10} players, including you if playing.`;
  }
  let scheduled: Date | null = null;
  if (draft.timing === 'future') {
    const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(draft.date);
    const time = /^(\d{2}):(\d{2})$/.exec(draft.time);
    if (!date) errors.date = 'Use YYYY-MM-DD.';
    if (!time) errors.time = 'Use HH:MM (24-hour time).';
    if (date && time) {
      const [year, month, day, hour, minute] = [date[1], date[2], date[3], time[1], time[2]].map(Number);
      scheduled = new Date(year, month - 1, day, hour, minute);
      if (year < 2000 || scheduled.getFullYear() !== year || scheduled.getMonth() !== month - 1 || scheduled.getDate() !== day) {
        errors.date = 'Enter a real calendar date.';
      }
      if (scheduled.getHours() !== hour || scheduled.getMinutes() !== minute) errors.time = 'Enter a valid local time.';
      if (!Object.keys(errors).length && scheduled.getTime() <= now.getTime()) errors.time = 'Choose a time in the future.';
    }
  }
  const data: OrganizerInput['data'] = {
    court_id: draft.courtId, format: draft.format, timing: draft.timing,
    organizer_plays: draft.organizerPlays, present_count: present, description: draft.description.trim(),
    ...(scheduled && !Object.keys(errors).length ? { scheduled_at: scheduled.toISOString() } : {}),
  };
  return { errors, data };
}

export function defaultSessionDraft(courtId = '', now = new Date()): SessionDraft {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return { courtId, format: '2v2', timing: 'now', date: `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth()+1)}-${pad(tomorrow.getDate())}`,
    time: '18:00', organizerPlays: true, presentCount: '1', description: '' };
}
export function restoredSessionDraft(data: OrganizerInput['data'], fallback: SessionDraft): SessionDraft {
  const scheduled = typeof data.scheduled_at === 'string' ? new Date(data.scheduled_at) : null;
  const pad = (value: number) => String(value).padStart(2, '0');
  const timeFields = scheduled && Number.isFinite(scheduled.getTime()) ? {
    date: `${scheduled.getFullYear()}-${pad(scheduled.getMonth()+1)}-${pad(scheduled.getDate())}`,
    time: `${pad(scheduled.getHours())}:${pad(scheduled.getMinutes())}`,
  } : {};
  return { ...fallback, ...timeFields, courtId: typeof data.court_id === 'string' ? data.court_id : fallback.courtId,
    format: pickupFormats.find(format => format === data.format) ?? fallback.format,
    timing: data.timing === 'future' ? 'future' : 'now', organizerPlays: data.organizer_plays === true,
    presentCount: String(data.present_count ?? 0), description: typeof data.description === 'string' ? data.description : '' };
}

export function managementActions(session: OwnedSession) {
  return { start: session.state === 'open', cancel: session.state === 'open',
    complete: session.state === 'started', edit: session.state === 'open',
    editCore: session.state === 'open' && !session.core_locked };
}
export function sessionStateLabel(state: string) {
  const labels: Record<string, string> = { open: 'Open invitation', started: 'Playing', cancelled: 'Cancelled', completed: 'Closed' };
  return labels[state] ?? 'Unavailable';
}
function withOccupancy(session: Database['public']['Tables']['pickup_sessions']['Row'], occupied: number): OwnedSession {
  if (session.capacity === null || !Number.isInteger(session.capacity) || session.capacity < 2 || occupied > session.capacity) {
    throw new OrganizerError('This game has invalid place information. Please refresh.');
  }
  return { ...session, capacity: session.capacity, occupied_places: occupied, available_places: session.capacity - occupied };
}

export async function loadOwnedSessions(client: SupabaseClient<Database>, owner: string, signal?: AbortSignal) {
  if (!uuid.test(owner)) throw new OrganizerError('Please sign in again.');
  let query = client.from('pickup_sessions').select('*,pickup_places(id)').eq('organizer_id', owner).order('created_at', { ascending: false });
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw new OrganizerError('Unable to load your games. Please retry.');
  return (data ?? []).map(({ pickup_places, ...session }) => withOccupancy(session, pickup_places.length));
}
export async function loadOwnedSession(client: SupabaseClient<Database>, owner: string, id: string, signal?: AbortSignal) {
  if (!uuid.test(owner) || !uuid.test(id)) throw new OrganizerError('Game not found.');
  let query = client.from('pickup_sessions').select('*,pickup_places(id)').eq('organizer_id', owner).eq('id', id);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query.maybeSingle();
  if (error) throw new OrganizerError('Unable to load this game. Please retry.');
  if (!data) throw new OrganizerError('This game is unavailable or belongs to another organizer.');
  const { pickup_places, ...session } = data;
  return withOccupancy(session, pickup_places.length);
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
async function checkIdentity(client: SupabaseClient<Database>, owner: string) {
  try {
    const identity = await client.auth.getUser();
    if (identity.error || identity.data.user?.id !== owner) throw new Error('Changed identity');
  } catch { throw new OrganizerError('Your session changed or could not be checked. Please sign in again.'); }
}
export async function executeOrganizerCommand(client: SupabaseClient<Database>, owner: string, input: OrganizerInput, requestId: string) {
  if (!uuid.test(owner) || !uuid.test(requestId)) throw new OrganizerError('Invalid game request.');
  await checkIdentity(client, owner);
  let receipt: Json;
  try {
    const { data, error } = await client.rpc('pickup_command', { p_request_id: requestId, p_action: input.action, p_data: input.data, p_expected_actor: owner });
    if (error) {
      if (error.code === 'PT409') throw new OrganizerError('This game changed or this action is no longer available. Refresh and try again.', false, true);
      if (error.code === '42501') {
        if (error.message === 'Organizer required') throw new OrganizerError('Only the organizer can manage this game.', false, true);
        throw new OrganizerError('Your account changed or this action is unavailable. Sign in again and retry the saved request.', true);
      }
      if (error.code && error.code !== 'PGRST000') throw new OrganizerError('Unable to save this game. Check your choices and try again.', false, true);
      throw new OrganizerError('We could not confirm the change. Retry the same request.', true);
    }
    receipt = data;
  } catch (error) {
    if (error instanceof OrganizerError) throw error;
    throw new OrganizerError('We could not confirm the change. Retry the same request.', true);
  }
  if (!record(receipt) || typeof receipt.id !== 'string' || !uuid.test(receipt.id)) {
    throw new OrganizerError('We could not confirm the change. Retry the same request.', true);
  }
  try {
    const current = await loadOwnedSession(client, owner, receipt.id);
    await checkIdentity(client, owner);
    return current;
  } catch {
    throw new OrganizerError('Your change may be saved. Retry to confirm it before making another change.', true);
  }
}

type Pending = { owner: string; backend: string; scope: string; requestId: string; input: OrganizerInput };
type RequestStorage = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void>; removeItem(key: string): Promise<void> };
export function createOrganizerRequestManager(options: {
  client: SupabaseClient<Database>; storage: RequestStorage; owner: string; backend: string; scope: string; makeId(): string;
}) {
  const { client, storage, owner, backend, scope, makeId } = options;
  const key = `pickup-request:${backend}:${owner}:${scope}`;
  let pending: Pending | null = null;
  let inFlight: Promise<OwnedSession> | null = null;
  function valid(value: unknown): value is Pending {
    return record(value) && value.owner === owner && value.backend === backend && value.scope === scope &&
      typeof value.requestId === 'string' && uuid.test(value.requestId) && record(value.input) &&
      ['create_session','edit_session','start','cancel','complete_session'].includes(String(value.input.action)) && record(value.input.data) &&
      (scope === 'create' ? value.input.action === 'create_session' : value.input.data.session_id === scope && value.input.action !== 'create_session');
  }
  return {
    get pending() { return pending; },
    get busy() { return Boolean(inFlight); },
    async load() {
      if (inFlight) return pending;
      const raw = await storage.getItem(key);
      pending = null;
      if (raw) {
        let parsed: unknown;
        try { parsed = JSON.parse(raw); } catch { parsed = null; }
        if (valid(parsed)) pending = parsed;
        else await storage.removeItem(key);
      }
      return pending;
    },
    send(input?: OrganizerInput) {
      if (inFlight) return inFlight;
      const task = (async () => {
        if (!pending) {
          if (!input) throw new OrganizerError('Choose an action first.');
          pending = { owner, backend, scope, requestId: makeId(), input };
        }
        const request = pending;
        try { await storage.setItem(key, JSON.stringify(request)); }
        catch { throw new OrganizerError('Unable to save this request on your device. Retry before continuing.', true); }
        let result: OwnedSession;
        try { result = await executeOrganizerCommand(client, owner, request.input, request.requestId); }
        catch (error) {
          if (error instanceof OrganizerError && error.rejected) {
            try { await storage.removeItem(key); pending = null; } catch { /* Keep the request if cleanup failed. */ }
          }
          throw error;
        }
        try { await storage.removeItem(key); pending = null; }
        catch { throw new OrganizerError('The change is saved, but this device could not finish confirming it. Retry.', true); }
        return result;
      })();
      inFlight = task;
      void task.finally(() => { inFlight = null; }).catch(() => { /* The caller renders the failure. */ });
      return task;
    },
  };
}
