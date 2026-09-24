const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createAuthController, authDestination } = require('../lib/auth/controller.ts');
const tick = () => new Promise(resolve => setImmediate(resolve));
const session = id => ({ access_token: `fixture-${id}`, refresh_token: 'fixture-refresh', user: { id } });
const profile = (id, display_name = 'Local player') => ({ id, display_name, app_role: 'player' });

function setup(initial = null, load = async id => profile(id)) {
  let stored = initial;
  let callback;
  let logoutError = null;
  let userError = null;
  let signupResult = { data: { session: null }, error: null };
  let signInError = null;
  let cleared = 0;
  const gateway = {
    getSession: async () => ({ data: { session: stored }, error: null }),
    getUser: async () => ({ data: { user: stored?.user }, error: userError }),
    onAuthStateChange: cb => { callback = cb; return { data: { subscription: { unsubscribe() { callback = undefined; } } } }; },
    signUp: async () => signupResult,
    signInWithPassword: async () => ({ data: { session: stored }, error: signInError }),
    signOut: async () => {
      if (logoutError) return { error: logoutError };
      stored = null; callback?.('SIGNED_OUT', null); return { error: null };
    },
  };
  const controller = createAuthController(gateway, load, async () => { cleared++; });
  return { controller, gateway, emit(value) { stored = value; return callback?.('SIGNED_IN', value); },
    setSignup(value) { signupResult = value; }, setLoginError(value) { signInError = value; },
    setLogoutError(value) { logoutError = value; }, setUserError(value) { userError = value; },
    cleared: () => cleared };
}

test('cold restore validates a session and routes a complete profile to discovery', async () => {
  const f = setup(session('a')); const stop = f.controller.start(); await tick();
  assert.equal(authDestination(f.controller.snapshot()), '/(tabs)/map'); stop();
});
test('a valid session with an incomplete profile resumes setup without an avatar', async () => {
  const f = setup(session('a'), async id => profile(id, ' ')); const stop = f.controller.start(); await tick();
  assert.equal(authDestination(f.controller.snapshot()), '/(auth)/profile-setup'); stop();
});
test('signup without session requires confirmation and stays unauthenticated', async () => {
  const f = setup(); const stop = f.controller.start(); await tick();
  const result = await f.controller.signUp('fixture@example.invalid', 'FixturePassword1', 'Fixture');
  assert.equal(result.requiresConfirmation, true); assert.equal(result.error, null);
  assert.equal(authDestination(f.controller.snapshot()), '/(auth)/signin'); stop();
});
test('invalid credentials remain retryable and are not reported as success', async () => {
  const f = setup(); const stop = f.controller.start(); await tick();
  f.setLoginError(new Error('Invalid credentials'));
  assert.ok((await f.controller.signIn('fixture@example.invalid', 'wrong')).error);
  f.setLoginError(null); f.emit(session('a'));
  assert.equal((await f.controller.signIn('fixture@example.invalid', 'correct')).error, null);
  await tick(); assert.equal(authDestination(f.controller.snapshot()), '/(tabs)/map'); stop();
});
test('profile network failure offers retry while preserving the session', async () => {
  let fail = true;
  const f = setup(session('a'), async id => { if (fail) throw new Error('Offline'); return profile(id); });
  const stop = f.controller.start(); await tick();
  assert.equal(f.controller.snapshot().session.user.id, 'a'); assert.ok(f.controller.snapshot().error);
  assert.equal(authDestination(f.controller.snapshot()), null);
  fail = false; await f.controller.retry(); assert.equal(authDestination(f.controller.snapshot()), '/(tabs)/map'); stop();
});
test('logout prevents a late profile response from restoring the previous account', async () => {
  let resolveProfile;
  const f = setup(session('a'), () => new Promise(resolve => { resolveProfile = resolve; }));
  const stop = f.controller.start(); await tick();
  assert.equal((await f.controller.signOut()).error, null);
  resolveProfile(profile('a')); await tick();
  assert.equal(f.controller.snapshot().session, null); assert.equal(f.controller.snapshot().user, null);
  assert.equal(f.cleared(), 1); stop();
});
test('auth callbacks are synchronous and stale A responses cannot replace B', async () => {
  let resolveA;
  const f = setup(session('a'), id => id === 'a' ? new Promise(resolve => { resolveA = resolve; }) : Promise.resolve(profile(id)));
  const stop = f.controller.start(); await tick();
  assert.equal(f.emit(session('b')), undefined); await tick(); resolveA(profile('a')); await tick();
  assert.equal(f.controller.snapshot().user.id, 'b'); stop();
});
test('logout failure is visible and retains an active session', async () => {
  const f = setup(session('a')); const stop = f.controller.start(); await tick();
  f.setLogoutError(new Error('Offline'));
  assert.ok((await f.controller.signOut()).error); assert.equal(f.controller.snapshot().session.user.id, 'a');
  assert.equal(f.cleared(), 0); stop();
});
test('invalid restored session is cleared and routes to sign in', async () => {
  const f = setup(session('a')); f.setUserError({ status: 401 });
  const stop = f.controller.start(); await tick(); await tick();
  assert.equal(authDestination(f.controller.snapshot()), '/(auth)/signin'); stop();
});
test('a stopped controller cannot overwrite a newly started lifecycle', async () => {
  let resolveFirst; let calls = 0;
  const f = setup(session('a'), id => ++calls === 1 ? new Promise(resolve => { resolveFirst = resolve; }) : Promise.resolve(profile(id)));
  const firstStop = f.controller.start(); await tick(); firstStop();
  const secondStop = f.controller.start(); await tick(); resolveFirst(profile('obsolete')); await tick();
  assert.equal(f.controller.snapshot().user.id, 'a'); secondStop();
});
test('late bootstrap storage result cannot replace a newer sign-in event', async () => {
  const f = setup(); let resolveStorage;
  f.gateway.getSession = () => new Promise(resolve => { resolveStorage = resolve; });
  const stop = f.controller.start(); f.emit(session('a')); await tick();
  resolveStorage({ data: { session: null }, error: null }); await tick();
  assert.equal(f.controller.snapshot().session.user.id, 'a'); stop();
});

test('consent failure blocks discovery and retries on the existing session', async () => {
  let fail = true;
  const f = setup(session('a'), async id => {
    if (fail) throw Object.assign(new Error('private backend details'), { name: 'ConsentSyncError' });
    return profile(id);
  });
  const stop = f.controller.start(); await tick();
  assert.equal(authDestination(f.controller.snapshot()), null);
  assert.match(f.controller.snapshot().error, /save your consent/);
  assert.doesNotMatch(f.controller.snapshot().error, /private backend/);
  fail = false; await f.controller.retry();
  assert.equal(authDestination(f.controller.snapshot()), '/(tabs)/map');
  stop();
});
