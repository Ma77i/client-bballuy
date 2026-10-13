const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { publicSession, publicRoster, sessionGroups, scheduledLabel, loadPublicSessions, loadPublicSession } = require('../lib/pickup/discovery.ts');
const { capacities } = require('../lib/pickup/organizer.ts');
const owner = '11111111-1111-4111-8111-111111111111';
const court = '22222222-2222-4222-8222-222222222222';
const id = '33333333-3333-4333-8333-333333333333';
function row(extra = {}) {
  return { id, court_id: court, organizer_id: owner, organizer_name: 'Organizer fixture', format: '2v2',
    capacity: 4, occupied_places: 2, available_places: 2, timing: 'now', scheduled_at: '2026-10-13T18:00:00Z',
    started_at: null, state: 'open', description: '', organizer_plays: false, ...extra };
}
function place(extra = {}) { return { id: randomUUID(), session_id: id, user_id: null, guest_label: 'Present player', display_name: 'Present player', ...extra }; }
function fixture({ sessions = [row()], places = [place(), place()] } = {}) {
  const calls = [], state = { reader: owner, error: false, switchAfterRead: false };
  const client = {
    auth: { getUser: async () => ({ data: { user: { id: state.reader } }, error: null }) },
    from(relation) {
      const call = { relation, filters: {}, offset: 0, end: 499 }; calls.push(call);
      const execute = async () => {
        if (state.switchAfterRead) state.reader = randomUUID();
        let data = relation === 'pickup_session_catalog' ? sessions : places;
        if (call.filters.id) data = data.filter(value => value.id === call.filters.id);
        if (call.filters.session_id) data = data.filter(value => value.session_id === call.filters.session_id);
        if (call.states) data = data.filter(value => call.states.includes(value.state));
        data = data.slice(call.offset, call.end + 1);
        return { data, error: state.error ? { message: 'internal error must not escape' } : null };
      };
      const query = { select(value) { call.columns = value; return query; }, in(key, values) { call.states = values; return query; },
        eq(key, value) { call.filters[key] = value; return query; }, order() { return query; },
        range(offset, end) { call.offset = offset; call.end = end; return query; },
        abortSignal(signal) { call.signal = signal; return query; },
        maybeSingle: async () => { const response = await execute(); return { ...response, data: response.data[0] ?? null }; },
        then(resolve, reject) { return execute().then(resolve, reject); } };
      return query;
    },
  };
  return { client, state, calls };
}
test('safe session projection verifies capacities and drops private or unrelated fields', () => {
  for (const format of Object.keys(capacities)) {
    const capacity = capacities[format];
    const safe = publicSession(row({ format, capacity, occupied_places: capacity, available_places: 0, private_contact: 'discarded' }));
    assert.equal(safe.available_places, 0);
    assert.equal(safe.private_contact, undefined);
  }
  for (const invalid of [{ capacity: 10 }, { occupied_places: 5 }, { occupied_places: -1 }, { occupied_places: 1.5 },
    { available_places: 3 }, { format: '3v3' }, { id: 'invalid' }, { scheduled_at: 'invalid' },
    { state: 'started' }, { state: 'invented' }, { organizer_plays: null }]) {
    assert.throws(() => publicSession(row(invalid)));
  }
});
test('discovery separates immediate, future and explicitly started activity without inferring attendance', () => {
  const now = Date.parse('2026-10-13T18:00:00Z');
  const rows = [row(), row({ id: randomUUID(), timing: 'future', scheduled_at: '2026-10-14T18:00:00Z' }),
    row({ id: randomUUID(), timing: 'future' }), row({ id: randomUUID(), state: 'started', started_at: '2026-10-13T17:00:00Z' }),
    row({ id: randomUUID(), state: 'cancelled' }), row({ id: randomUUID(), state: 'completed' })].map(publicSession);
  const groups = sessionGroups(rows, now);
  assert.equal(groups.immediate.length, 1); assert.equal(groups.upcoming.length, 1); assert.equal(groups.playing.length, 1);
  assert.match(scheduledLabel(rows[2], now), /Planned time has passed/);
  assert.match(scheduledLabel(rows[3], now), /^Started /);
  assert.equal(sessionGroups([rows[3]], now + 86400000).playing.length, 1, 'an old report retains its start time, not an invented expiry');
  assert.equal(sessionGroups([publicSession(row({ capacity: 4, occupied_places: 4, available_places: 0 }))], now).immediate.length, 1);
});
test('roster distinguishes guests and registered players and rejects cross-session or duplicate places', () => {
  const guest = place({ email: 'discarded' }), registered = place({ user_id: owner, guest_label: null, display_name: 'Account fixture' });
  const safe = publicRoster([guest, registered], id);
  assert.equal(safe[0].guest, true); assert.equal(safe[1].guest, false); assert.equal(safe[0].email, undefined);
  assert.throws(() => publicRoster([guest, guest], id));
  assert.throws(() => publicRoster([guest], randomUUID()));
  assert.throws(() => publicRoster([place({ guest_label: null })], id));
  assert.throws(() => publicRoster([registered, { ...registered, id: randomUUID() }], id));
});
test('authenticated discovery pages beyond the server page size using only safe read views', async () => {
  const sessions = Array.from({ length: 501 }, () => row({ id: randomUUID() }));
  const f = fixture({ sessions }), signal = new AbortController().signal;
  assert.equal((await loadPublicSessions(f.client, owner, signal)).length, 501);
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[1].offset, 500);
  for (const call of f.calls) {
    assert.equal(call.relation, 'pickup_session_catalog'); assert.equal(call.signal, signal);
    assert.deepEqual(call.states, ['open', 'started']); assert.ok(!call.columns.includes('*'));
  }
});
test('details read cancelled and completed sessions by ID with safe names and reconcile concurrent roster changes', async () => {
  for (const state of ['cancelled', 'completed']) {
    const f = fixture({ sessions: [row({ state })], places: [place()] });
    const detail = await loadPublicSession(f.client, owner, id);
    assert.equal(detail.game.state, state); assert.equal(detail.rosterChanged, true);
    assert.deepEqual(f.calls.map(call => call.relation), ['pickup_session_catalog', 'pickup_roster']);
    assert.equal(f.calls[1].filters.session_id, id);
    assert.ok(!f.calls[1].columns.includes('*'));
  }
});
test('anonymous, switched readers, malformed IDs and read failures never become empty success', async () => {
  const f = fixture();
  await assert.rejects(loadPublicSessions(f.client, ''), /Sign in/); assert.equal(f.calls.length, 0);
  await assert.rejects(loadPublicSession(f.client, owner, 'bad'), /not found/); assert.equal(f.calls.length, 0);
  f.state.error = true; await assert.rejects(loadPublicSessions(f.client, owner), /Unable to load games/);
  await assert.rejects(loadPublicSession(f.client, owner, id), /Unable to load game details/);
  f.state.error = false; f.state.switchAfterRead = true;
  await assert.rejects(loadPublicSessions(f.client, owner), /confirm your session/);
  const missing = fixture({ sessions: [] });
  await assert.rejects(loadPublicSession(missing.client, owner, id), /not found/);
});
