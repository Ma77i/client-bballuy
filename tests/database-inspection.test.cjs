const assert = require('node:assert/strict');
const { Buffer } = require('node:buffer');
const { test } = require('node:test');
const { inspectionRequest, summarizeSchema } = require('../scripts/inspect-database-api.mjs');

const env = { EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', EXPO_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_test' };
const jwt = role => `header.${Buffer.from(JSON.stringify({ role })).toString('base64url')}.signature`;

test('inspection targets only API metadata and does not treat a publishable key as a JWT', () => {
  const request = inspectionRequest(env);
  assert.equal(request.url.href, 'https://example.supabase.co/rest/v1/');
  assert.equal(request.headers.Accept, 'application/openapi+json');
  assert.equal(request.headers.Authorization, undefined);
});

test('inspection rejects privileged keys and insecure remote endpoints', () => {
  assert.throws(() => inspectionRequest({ ...env, EXPO_PUBLIC_SUPABASE_ANON_KEY: jwt('service_role') }), /public anon role/);
  assert.throws(() => inspectionRequest({ ...env, EXPO_PUBLIC_SUPABASE_URL: 'http://example.supabase.co' }), /HTTPS/);
  assert.throws(() => inspectionRequest({ ...env, EXPO_PUBLIC_SUPABASE_URL: 'https://user:secret@example.supabase.co' }), /credentials/);
  assert.throws(() => inspectionRequest({ ...env, EXPO_PUBLIC_SUPABASE_ANON_KEY: 'sb_secret_test' }), /publishable key/);
});

test('legacy anon keys are accepted without exposing claims in the result', () => {
  const key = jwt('anon');
  const request = inspectionRequest({ ...env, EXPO_PUBLIC_SUPABASE_ANON_KEY: key });
  assert.equal(request.headers.Authorization, `Bearer ${key}`);
});

test('metadata summary excludes examples, defaults, descriptions and unrelated tables', () => {
  const report = summarizeSchema({ swagger: '2.0', paths: {}, definitions: {
    users_public: { required: ['id'], properties: {
      id: { type: 'string', format: 'uuid', description: 'private detail', example: 'personal value', default: 'secret' },
    } }, unrelated: { properties: { private: { type: 'string' } } },
  } });
  assert.deepEqual(report[0].columns, [{ name: 'id', type: 'string', format: 'uuid', requiredByApi: true }]);
  assert.equal(report[2].visibility, 'not_exposed_or_absent');
  assert.doesNotMatch(JSON.stringify(report), /secret|personal value|private detail|unrelated/);
});

test('an error payload cannot masquerade as a successful empty schema', () => {
  assert.throws(() => summarizeSchema({ message: 'Not authorized' }), /OpenAPI/);
});
