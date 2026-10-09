const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createConsentSync } = require('../lib/auth/consent.ts');
const draft = JSON.stringify({ tos: true, privacy: true, version: '1.0.0', acceptedAt: '2026-09-23T12:00:00Z' });
function fixture(write = async () => ({ error: null })) {
  const values = new Map([['pendingConsent', draft]]);
  const storage = { getItem: async k => values.get(k) ?? null,
    setItem: async (k, v) => { values.set(k, v); }, removeItem: async k => { values.delete(k); } };
  return { values, storage, sync: createConsentSync(storage, 'local', write) };
}
test('consent survives failed persistence and retries without registering again', async () => {
  let fail = true; const rows = [];
  const f = fixture(async row => { rows.push(row); return { error: fail ? { code: '42501', message: 'private details' } : null }; });
  await f.sync.prepare('A@example.invalid');
  await assert.rejects(f.sync.sync('a', 'a@example.invalid'), e => e.name === 'ConsentSyncError' && !e.message.includes('private details'));
  assert.equal(f.values.size, 1);
  fail = false;
  await f.sync.sync('a', 'a@example.invalid');
  assert.equal(f.values.size, 0);
  assert.equal(rows[1].user_id, 'a');
  assert.equal(rows[1].accepted_at, '2026-09-23T12:00:00Z');
});
test('unbound, other-account and other-backend drafts are never auto-applied', async () => {
  let writes = 0; const write = async () => { writes++; return { error: null }; };
  const f = fixture(write);
  await f.sync.sync('a', 'a@example.invalid');
  await f.sync.prepare('a@example.invalid');
  await f.sync.sync('b', 'b@example.invalid');
  await createConsentSync(f.storage, 'other-backend', write).sync('a', 'a@example.invalid');
  assert.equal(writes, 0);
  // Represents restoring/signing in after email confirmation with the same store.
  await createConsentSync(f.storage, 'local', write).sync('a', 'a@example.invalid');
  assert.equal(writes, 1);
});
test('malformed or incomplete consent never reaches signup persistence', async () => {
  for (const raw of ['{', '{}', JSON.stringify({ tos: true, privacy: false, version: '1', acceptedAt: 'bad' })]) {
    const f = fixture(); f.values.set('pendingConsent', raw);
    await assert.rejects(f.sync.prepare('a@example.invalid'), /Privacy & Terms/);
    assert.equal(f.values.get('pendingConsent'), raw);
    assert.equal(f.values.size, 1);
  }
});
test('a newer pending record is not removed by an older write', async () => {
  const f = fixture(async () => {
    f.values.set('pendingConsent:local:a@example.invalid', draft.replace('1.0.0', '2.0.0'));
    return { error: null };
  });
  await f.sync.prepare('a@example.invalid'); await f.sync.sync('a', 'a@example.invalid');
  assert.match(f.values.get('pendingConsent:local:a@example.invalid'), /2.0.0/);
});
test('storage failure is recoverable without exposing underlying details', async () => {
  const f = fixture(); await f.sync.prepare('a@example.invalid');
  f.storage.removeItem = async () => { throw new Error('private storage detail'); };
  await assert.rejects(f.sync.sync('a', 'a@example.invalid'), { name: 'ConsentSyncError' });
  assert.equal(f.values.size, 1);
});
