const { test } = require('node:test');
const assert = require('node:assert/strict');
const { discoveryReducer: reduce, initialDiscovery: initial, sheetGesture } = require('../components/courts/discovery-state.ts');
const { filterCourts } = require('../lib/courts/catalog.ts');

test('explicit detail location selects map and replaces one compact preview immediately', () => {
  const before = { mode: 'list', search: 'Palermo', selectedId: null, expanded: false };
  const state = reduce(before, { type: 'focus', id: 'palermo', clearSearch: false });
  assert.deepEqual(state, { mode: 'map', search: 'Palermo', selectedId: 'palermo', expanded: false });
  const next = reduce({ ...state, expanded: true }, { type: 'focus', id: 'rodo', clearSearch: true });
  assert.deepEqual(next, { mode: 'map', search: '', selectedId: 'rodo', expanded: false });
  assert.equal(reduce(next, { type: 'close' }).selectedId, null);
  assert.equal(reduce(next, { type: 'select', id: 'palermo' }).selectedId, 'palermo');
  const region = { latitude: -34.9076, longitude: -56.174, latitudeDelta: .015, longitudeDelta: .015 };
  const centered = reduce(initial, { type: 'focus', id: 'palermo', region, clearSearch: true });
  assert.deepEqual(centered.focusRegion, region);
  assert.equal(reduce(centered, { type: 'focus-applied' }).focusRegion, null);
});

test('list-first discovery keeps one latest selection and dismisses without changing search', () => {
  assert.equal(initial.mode, 'list');
  assert.deepEqual(reduce(initial, { type: 'select', id: 'a' }), initial);
  let state = reduce(initial, { type: 'mode', mode: 'map' });
  state = reduce(state, { type: 'search', search: 'Rodó' });
  state = reduce(state, { type: 'select', id: 'a' });
  state = reduce(state, { type: 'expand' });
  state = reduce(state, { type: 'select', id: 'b' });
  assert.equal(state.selectedId, 'b'); assert.equal(state.expanded, false);
  assert.equal(reduce(state, { type: 'mode', mode: 'map' }).selectedId, 'b');
  assert.equal(reduce(state, { type: 'close' }).search, 'Rodó');
  assert.equal(reduce(state, { type: 'mode', mode: 'list' }).selectedId, null);
});
test('shared filtered IDs remove a stale selection, including empty/error catalog reconciliation', () => {
  const rows = [{ id: 'a', name: 'Parque Rodó' }, { id: 'b', name: 'Palermo' }];
  let state = reduce(reduce(initial, { type: 'mode', mode: 'map' }), { type: 'select', id: 'b' });
  state = reduce(state, { type: 'reconcile', ids: filterCourts(rows, 'rodo').map(c => c.id) });
  assert.equal(state.selectedId, null);
  state = reduce(state, { type: 'select', id: 'a' });
  assert.equal(reduce(state, { type: 'reconcile', ids: ['a'] }).selectedId, 'a');
  assert.equal(reduce(state, { type: 'reconcile', ids: [] }).selectedId, null);
});
test('selection, close and expansion have no animation completion dependency', () => {
  let state = reduce(initial, { type: 'mode', mode: 'map' });
  for (let i = 0; i < 30; i++) state = reduce(state, { type: 'select', id: String(i) });
  assert.equal(state.selectedId, '29');
  assert.equal(reduce(state, { type: 'close' }).selectedId, null);
  assert.equal(reduce(initial, { type: 'expand' }).expanded, false);
});
test('handle drag is optional, vertical and threshold bounded', () => {
  assert.equal(sheetGesture(71, 2), 'close');
  assert.equal(sheetGesture(-41, 2), 'expand');
  assert.equal(sheetGesture(8, 1), null);
  assert.equal(sheetGesture(90, 120), null);
});
