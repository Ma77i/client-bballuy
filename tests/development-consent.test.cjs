const { test } = require('node:test');
const assert = require('node:assert/strict');
const { saveDevelopmentConsent, createConsentSync } = require('../lib/auth/consent.ts');

test('development acknowledgement requires both selections before writing', async () => {
  let writes = 0;
  const storage = { setItem: async () => { writes++; } };
  for (const pair of [[false, false], [true, false], [false, true]]) {
    await assert.rejects(saveDevelopmentConsent(storage, ...pair), /Both/);
  }
  assert.equal(writes, 0);
});

test('failed development draft save can retry and sync its distinct version', async () => {
  const values = new Map();
  let fail = true;
  const storage = {
    getItem: async key => values.get(key) ?? null,
    setItem: async (key, value) => { if (fail) throw Error('Storage unavailable'); values.set(key, value); },
    removeItem: async key => { values.delete(key); },
  };
  await assert.rejects(saveDevelopmentConsent(storage, true, true));
  assert.equal(values.size, 0);
  fail = false;
  await saveDevelopmentConsent(storage, true, true);
  const draft = JSON.parse(values.get('pendingConsent'));
  assert.equal(draft.version, 'dev-preview-1');
  assert.equal(draft.tos, true);
  assert.equal(draft.privacy, true);
  assert.ok(Number.isFinite(Date.parse(draft.acceptedAt)));
  let saved;
  const sync = createConsentSync(storage, 'local-test', async row => { saved = row; return { error: null }; });
  await sync.prepare('fixture@example.invalid');
  await sync.sync('fixture-id', 'fixture@example.invalid');
  assert.equal(saved.tos_version, 'dev-preview-1');
  assert.equal(saved.privacy_version, 'dev-preview-1');
  assert.equal(values.size, 0);
});
