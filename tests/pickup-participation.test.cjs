const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { createParticipationManager, participationState, loadPersonalSessions } = require('../lib/pickup/participation.ts');
const owner = '11111111-1111-4111-8111-111111111111', other = '22222222-2222-4222-8222-222222222222';
const sessionId = '33333333-3333-4333-8333-333333333333', court = '44444444-4444-4444-8444-444444444444';
function row(extra = {}) { return { id: sessionId, court_id: court, organizer_id: other, organizer_name: 'Organizer fixture', format: '2v2',
  capacity: 4, occupied_places: 0, available_places: 4, timing: 'now', scheduled_at: new Date().toISOString(),
  started_at: null, state: 'open', description: '', organizer_plays: false, ...extra }; }
function place(id = sessionId, user = owner) { return { id: randomUUID(), session_id: id, user_id: user, guest_label: null, display_name: 'Player fixture' }; }
function fixture() {
  const saved = new Map(), receipts = new Map(), calls = [], sessions = [row()], places = [];
  const state = { actor: owner, loseResponse: false, readFailure: false, reject: null, failSave: false, failRemove: false, switchOnRpc: false, switchOnRead: false, gate: null };
  const client = {
    auth: { getUser: async () => ({ data: { user: { id: state.actor } }, error: null }) },
    rpc: async (_, args) => {
      calls.push({ type: 'rpc', ...args });
      if (state.gate) await state.gate;
      if (state.switchOnRpc) state.actor = other;
      if (args.p_expected_actor !== state.actor) return { data: null, error: { code: '42501' } };
      if (state.reject) return { data: null, error: { code: state.reject } };
      if (!receipts.has(args.p_request_id)) {
        if (args.p_action === 'join' && !places.some(p => p.user_id === owner)) places.push(place());
        if (args.p_action === 'leave') places.splice(0, places.length);
        sessions[0].occupied_places = places.length; sessions[0].available_places = 4 - places.length;
        receipts.set(args.p_request_id, { id: sessionId });
      }
      if (state.loseResponse) { state.loseResponse = false; throw new Error('Lost reply'); }
      return { data: receipts.get(args.p_request_id), error: null };
    },
    from(relation) {
      const call = { type: 'read', relation, filters: {}, offset: 0, end: 499 }; calls.push(call);
      const execute = async () => {
        let data = relation === 'pickup_roster' ? places : sessions;
        for (const [key, value] of Object.entries(call.filters)) data = data.filter(item => item[key] === value);
        if (call.ids) data = data.filter(item => call.ids.includes(item.id));
        if (state.switchOnRead) state.actor = other;
        return { data: data.slice(call.offset, call.end + 1), error: state.readFailure ? { message: 'Read failed' } : null };
      };
      const q = { select(value) { call.columns = value; return q; }, eq(key, value) { call.filters[key] = value; return q; },
        in(key, values) { call.ids = values; return q; }, order() { return q; }, range(offset, end) { call.offset = offset; call.end = end; return q; },
        abortSignal(signal) { call.signal = signal; return q; },
        maybeSingle: async () => { const r = await execute(); return { ...r, data: r.data[0] ?? null }; },
        then(resolve, reject) { return execute().then(resolve, reject); } };
      return q;
    },
  };
  const storage = { getItem: async key => saved.get(key) ?? null,
    setItem: async (key, value) => { if (state.failSave) throw new Error('Storage failed'); saved.set(key, value); },
    removeItem: async key => { if (state.failRemove) throw new Error('Storage failed'); saved.delete(key); } };
  const manager = (extra = {}) => createParticipationManager({ client, storage, owner, backend: 'local', sessionId, makeId: randomUUID, ...extra });
  return { client, state, manager, storage, saved, receipts, calls, sessions, places };
}
test('join, leave and rejoin use confirmed membership and identity-bound commands', async () => {
  const f = fixture(), manager = f.manager();
  assert.equal(participationState(await manager.send('join'), owner).joined, true);
  assert.equal(participationState(await manager.send('leave'), owner).joined, false);
  assert.equal(participationState(await manager.send('join'), owner).joined, true);
  assert.equal(f.places.length, 1); assert.equal(f.saved.size, 0);
  assert.ok(f.calls.filter(call => call.type === 'rpc').every(call => call.p_expected_actor === owner));
});
test('lost join reply reopens with the same UUID, blocks an opposite action and creates one place', async () => {
  const f = fixture(); f.state.loseResponse = true;
  const first = f.manager(); await assert.rejects(first.send('join'));
  const retry = f.manager(), pending = await retry.load();
  const result = await retry.send('leave');
  assert.equal(participationState(result, owner).joined, true);
  const calls = f.calls.filter(call => call.type === 'rpc');
  assert.equal(calls[0].p_request_id, pending.requestId); assert.equal(calls[1].p_request_id, pending.requestId);
  assert.equal(calls[1].p_action, 'join'); assert.equal(f.places.length, 1); assert.equal(retry.pending, null);
});
test('failed readback preserves a saved leave and old receipt replay reports current membership', async () => {
  const f = fixture(), initial = f.manager(); await initial.send('join');
  f.state.readFailure = true; await assert.rejects(initial.send('leave'), /may be saved/);
  const key = initial.pending.requestId; f.state.readFailure = false;
  await f.client.rpc('pickup_command', { p_request_id: randomUUID(), p_action: 'join', p_expected_actor: owner });
  const retry = f.manager(); await retry.load();
  assert.equal(retry.pending.requestId, key);
  const result = await retry.send();
  assert.equal(participationState(result, owner).joined, true, 'old leave receipt does not erase a newer join');
});
test('double presses and focusing an in-flight request do not clear or replace the request', async () => {
  const f = fixture(); let release; f.state.gate = new Promise(resolve => { release = resolve; });
  const manager = f.manager(), a = manager.send('join'), b = manager.send('leave');
  assert.equal(a, b); assert.ok(await manager.load()); assert.equal(manager.busy, true);
  release(); await a;
  assert.equal(f.calls.filter(call => call.type === 'rpc').length, 1); assert.equal(f.places.length, 1);
});
test('storage failure prevents transport and cleanup failure remains safely retryable', async () => {
  const f = fixture(), manager = f.manager(); f.state.failSave = true;
  await assert.rejects(manager.send('join')); assert.equal(f.calls.length, 0);
  f.state.failSave = false; f.state.failRemove = true;
  await assert.rejects(manager.send()); assert.equal(f.places.length, 1); assert.ok(manager.pending);
  f.state.failRemove = false; await manager.send(); assert.equal(f.places.length, 1); assert.equal(manager.pending, null);
});
test('definite rejection clears the choice while changed actor and gateway failures retain uncertainty', async () => {
  const f = fixture(), manager = f.manager(); f.state.reject = 'PT409';
  await assert.rejects(manager.send('join')); assert.equal(manager.pending, null);
  f.state.reject = 'PGRST000'; await assert.rejects(manager.send('join')); assert.ok(manager.pending);
  f.state.reject = null; f.state.switchOnRpc = true;
  await assert.rejects(manager.send()); assert.ok(manager.pending); assert.equal(f.places.length, 0);
});
test('pending records and late readback cannot cross backend, account or session scope', async () => {
  const f = fixture(), manager = f.manager(); f.state.loseResponse = true;
  await assert.rejects(manager.send('join'));
  assert.equal(await f.manager({ owner: other }).load(), null);
  assert.equal(await f.manager({ backend: 'other' }).load(), null);
  assert.equal(await f.manager({ sessionId: randomUUID() }).load(), null);
  f.state.switchOnRead = true; await assert.rejects(manager.send()); assert.ok(manager.pending);
});
test('full sessions allow their existing player to leave, but started/closed/inconsistent reads allow no changes', () => {
  const detail = { game: row({ available_places: 0, occupied_places: 4 }), places: [place()], rosterChanged: false };
  assert.equal(participationState(detail, owner).canLeave, true); assert.equal(participationState(detail, other).canJoin, false);
  for (const state of ['started', 'cancelled', 'completed']) {
    const current = participationState({ ...detail, game: { ...detail.game, state } }, owner);
    assert.equal(current.canLeave, false); assert.equal(current.canJoin, false);
  }
  assert.equal(participationState({ ...detail, rosterChanged: true }, owner).canLeave, false);
});
test('My sessions deduplicates organizing/playing and retains cancellation until registration leaves', async () => {
  const f = fixture(); f.sessions[0].organizer_id = owner; f.places.push(place());
  const cancelledId = randomUUID(); f.sessions.push(row({ id: cancelledId, state: 'cancelled' })); f.places.push(place(cancelledId));
  const signal = new AbortController().signal;
  let entries = await loadPersonalSessions(f.client, owner, signal);
  assert.equal(entries.length, 2); assert.ok(entries.find(entry => entry.game.id === sessionId).organizing);
  assert.ok(entries.find(entry => entry.game.id === sessionId).joined);
  assert.equal(entries.find(entry => entry.game.id === cancelledId).game.state, 'cancelled');
  f.places.splice(0, f.places.length); entries = await loadPersonalSessions(f.client, owner);
  assert.equal(entries.length, 1); assert.equal(entries[0].joined, false); assert.equal(entries[0].organizing, true);
  assert.ok(f.calls.filter(call => call.type === 'read').every(call => !call.columns.includes('*')));
});
test('personal read errors and identity changes never report another account or an empty success', async () => {
  const f = fixture(); f.state.readFailure = true;
  await assert.rejects(loadPersonalSessions(f.client, owner), /Unable to load/);
  f.state.readFailure = false; f.state.switchOnRead = true;
  await assert.rejects(loadPersonalSessions(f.client, owner), /confirm your session/);
  await assert.rejects(loadPersonalSessions(f.client, ''), /Sign in/);
});
test('personal pagination keeps all organizer and participant entries beyond a server page', async () => {
  for (const organizing of [true, false]) {
    const f = fixture(); f.sessions.splice(0, f.sessions.length);
    for (let i = 0; i < 501; i++) {
      const id = randomUUID();
      f.sessions.push(row({ id, organizer_id: organizing ? owner : other, occupied_places: 1, available_places: 3 }));
      f.places.push(place(id));
    }
    const entries = await loadPersonalSessions(f.client, owner);
    assert.equal(entries.length, 501);
    assert.ok(entries.every(entry => entry.joined && entry.organizing === organizing));
    const rosterReads = f.calls.filter(call => call.relation === 'pickup_roster');
    assert.equal(rosterReads.length, 2); assert.equal(rosterReads[1].offset, 500);
    assert.ok(rosterReads.every(call => call.filters.user_id === owner));
  }
});
