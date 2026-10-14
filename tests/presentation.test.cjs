const { test } = require('node:test');
const assert = require('node:assert/strict');
const { palette, surfaces } = require('../constants/design.ts');
const { observeMotionPreference, pressPresentation } = require('../components/foundation/motion-policy.ts');
const { presentationFont } = require('../components/foundation/font-policy.ts');
const { usableMediaSource } = require('../components/foundation/media-policy.ts');

function luminance(hex) {
  const linear = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
function ratio(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
test('approved text, status and meaningful boundaries meet contrast on both surface tones', () => {
  assert.ok(ratio(palette.navy, palette.orange) >= 4.5);
  assert.ok(ratio(palette.navy, palette.orangePressed) >= 4.5);
  for (const colors of Object.values(surfaces)) {
    for (const text of ['text', 'muted', 'error', 'success', 'warning']) assert.ok(ratio(colors[text], colors.panel) >= 4.5, text);
    assert.ok(ratio(colors.boundary, colors.panel) >= 3);
    assert.ok(ratio(colors.focus, colors.panel) >= 3);
  }
});
test('reduced motion, inactive app and blocked actions never scale or wait', () => {
  for (const args of [[true, false, true, true], [true, true, false, true], [true, false, false, false]]) {
    assert.deepEqual(pressPresentation(...args), { scale: 1, duration: 0 });
  }
  assert.equal(pressPresentation(true, false, false, true).scale, .98);
});
test('a preference event wins a slow initial query and cleanup ignores late results', async () => {
  let resolve, listener, removed = 0;
  const values = [];
  const stop = observeMotionPreference(() => new Promise(done => { resolve = done; }),
    callback => { listener = callback; return () => removed++; }, value => values.push(value));
  listener(true); resolve(false); await Promise.resolve();
  assert.deepEqual(values, [true]); stop(); listener(false);
  assert.equal(removed, 1); assert.deepEqual(values, [true]);
});
test('unavailable motion preference defaults safely and late query cannot update an unmounted consumer', async () => {
  const values = [];
  const stop = observeMotionPreference(() => Promise.reject(new Error('Unavailable')), () => () => {}, v => values.push(v));
  await Promise.resolve(); assert.deepEqual(values, [true]); stop();
  let resolve;
  const stopLate = observeMotionPreference(() => new Promise(done => { resolve = done; }), () => () => {}, v => values.push(v));
  stopLate(); resolve(false); await Promise.resolve(); assert.deepEqual(values, [true]);
  const stopSync = observeMotionPreference(() => { throw new Error('Unavailable native API'); },
    () => () => {}, v => values.push(v));
  assert.deepEqual(values, [true, true]); stopSync();
});
test('font failure falls back to loaded Lexend or system without replacing caller system fonts', () => {
  assert.equal(presentationFont('Teko-SemiBold', family => family === 'Lexend-Bold'), 'Lexend-Bold');
  assert.equal(presentationFont('Lexend-Regular', () => false), undefined);
  assert.equal(presentationFont('Teko-SemiBold', () => false), undefined);
  assert.equal(presentationFont('Arial', () => false), 'Arial');
});
test('missing or empty media source selects local art without waiting for an error callback', () => {
  assert.equal(usableMediaSource(), undefined);
  assert.equal(usableMediaSource({ uri: '  ' }), undefined);
  assert.equal(usableMediaSource(0), undefined);
  assert.equal(usableMediaSource(-1), undefined);
  assert.equal(usableMediaSource(2), 2);
  assert.deepEqual(usableMediaSource({ uri: ' data:image/png;base64,AA== ' }), { uri: 'data:image/png;base64,AA==' });
});
test('bundled fonts retain Spanish coverage, notices and optimized artwork integrity', async () => {
  const { verifyAssets } = await import('../scripts/verify-presentation-assets.mjs');
  const result = verifyAssets();
  assert.equal(result.fonts, 5); assert.equal(result.illustrations, 2);
  assert.ok(result.totalIllustrationBytes < 65536);
});
