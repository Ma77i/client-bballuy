import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'node:module';
const { createConsentSync } = createRequire(import.meta.url)('../../lib/auth/consent.ts');
const { setCourtMembership } = createRequire(import.meta.url)('../../lib/courts/membership.ts');
const { loadCatalog } = createRequire(import.meta.url)('../../lib/courts/catalog.ts');
const { loadMyCourts } = createRequire(import.meta.url)('../../lib/auth/my-courts.ts');
const { sessionOptions } = createRequire(import.meta.url)('../../lib/auth/options.ts');

export async function verifySessions({ publicKey, adminKey, database }) {
  const url = 'http://127.0.0.1:55431';
  const emails = [randomUUID(), randomUUID()].map(id => `t04-${id}@example.invalid`);
  const password = `${randomUUID()}Aa1!`;
  const values = new Map();
  const storage = {
    async getItem(key) { return values.get(key) ?? null; },
    async setItem(key, value) { values.set(key, value); },
    async removeItem(key) { values.delete(key); },
  };
  const clients = [];
  let checks = 0;
  function check(condition, label) { if (!condition) throw new Error(`Local session check failed: ${label}`); checks++; }
  function client() {
    const value = createClient(url, publicKey, { auth: { ...sessionOptions(storage), storageKey: 't04-session' } });
    clients.push(value); return value;
  }
  // Admin credential is used only to prepare an unconfirmed local fixture/link.
  const admin = createClient(url, adminKey, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const first = client();
    const signup = await first.auth.signUp({ email: emails[0], password, options: { data: { display_name: '' } } });
    check(!signup.error && Boolean(signup.data.session), 'signup with immediate local session');
    const id = signup.data.user.id;
    const discovery = await loadCatalog(first);
    check(discovery.length === 3 && discovery.every(court => court.id && court.name), 'discovery reader returns the three validated courts');
    const consentStore = new Map();
    const consentStorage = { getItem: async key => consentStore.get(key) ?? null,
      setItem: async (key, value) => { consentStore.set(key, value); },
      removeItem: async key => { consentStore.delete(key); } };
    const pendingConsent = JSON.stringify({ tos: true, privacy: true,
      version: '1.0.0', acceptedAt: new Date().toISOString() });
    consentStore.set('pendingConsent', pendingConsent);
    const consentSync = createConsentSync(consentStorage, url, row => first.from('user_consents').upsert(row));
    await consentSync.prepare(emails[0]);
    await consentSync.sync(id, emails[0]);
    const consent = await first.from('user_consents').select('tos_version,privacy_version').eq('user_id', id).single();
    check(!consent.error && consent.data.tos_version === '1.0.0' && consent.data.privacy_version === '1.0.0', 'signup consent persisted through client helper');
    check(consentStore.size === 0, 'persisted consent clears pending storage');
    // Repeat an acknowledged payload, as after an interrupted local cleanup.
    consentStore.set('pendingConsent', pendingConsent);
    await consentSync.prepare(emails[0]); await consentSync.sync(id, emails[0]);
    check(consentStore.size === 0, 'consent retry is idempotent');
    const initial = await first.from('users_public').select('*').eq('id', id).single();
    check(!initial.error && initial.data.display_name === '', 'incomplete trigger-created profile');
    const saved = await first.from('users_public').update({ display_name: 'T04 player' }).eq('id', id).select('*').single();
    check(!saved.error && saved.data.avatar_url === null, 'minimal profile saved without avatar');
    check(values.has('t04-session'), 'SDK persists session through the configured adapter');
    await first.auth.stopAutoRefresh();

    const restored = client();
    const restoredSession = await restored.auth.getSession();
    check(!restoredSession.error && restoredSession.data.session?.user.id === id, 'fresh client restores session');
    const verified = await restored.auth.getUser();
    check(!verified.error && verified.data.user.id === id, 'restored session accepted by Auth');
    const profile = await restored.from('users_public').select('display_name').eq('id', id).single();
    check(!profile.error && profile.data.display_name === 'T04 player', 'profile persists after client recreation');
    const refreshed = await restored.auth.refreshSession();
    check(!refreshed.error && refreshed.data.session?.user.id === id, 'refresh returns a valid session');
    await restored.auth.stopAutoRefresh();

    // Force expiration in the disposable adapter, then exercise real refresh on restore.
    const expired = JSON.parse(values.get('t04-session'));
    expired.expires_at = 1;
    values.set('t04-session', JSON.stringify(expired));
    const expiredClient = client();
    const recovered = await expiredClient.auth.getSession();
    check(!recovered.error && recovered.data.session?.expires_at > Date.now() / 1000,
      'expired persisted session refreshes during restore');
    const logout = await expiredClient.auth.signOut({ scope: 'local' });
    check(!logout.error && !values.has('t04-session'), 'logout removes persisted session');
    await expiredClient.auth.stopAutoRefresh();
    const loggedOut = client();
    check((await loggedOut.auth.getSession()).data.session === null, 'fresh client remains signed out');
    const wrong = await loggedOut.auth.signInWithPassword({ email: emails[0], password: 'WrongPassword1!' });
    check(Boolean(wrong.error) && !wrong.data.session, 'wrong password rejected');
    const login = await loggedOut.auth.signInWithPassword({ email: emails[0], password });
    check(!login.error && Boolean(login.data.session), 'correct password succeeds after retry');
    check(/^[0-9a-f-]{36}$/.test(id), 'fixture ID validated before local SQL');
    database(`DELETE FROM auth.sessions WHERE user_id = '${id}';`);
    const revoked = await loggedOut.auth.refreshSession();
    check(Boolean(revoked.error) && !revoked.data.session, 'revoked session cannot refresh');
    check((await loggedOut.auth.getSession()).data.session === null && !values.has('t04-session'),
      'revocation clears persisted authentication');
    await loggedOut.auth.stopAutoRefresh();

    const unconfirmed = await admin.auth.admin.createUser({ email: emails[1], password, email_confirm: false });
    check(!unconfirmed.error, 'unconfirmed local fixture created');
    const pendingClient = client();
    const pending = await pendingClient.auth.signInWithPassword({ email: emails[1], password });
    check(Boolean(pending.error) && !pending.data.session, 'unconfirmed account cannot sign in');
    const link = await admin.auth.admin.generateLink({ type: 'signup', email: emails[1], password });
    check(!link.error && Boolean(link.data.properties?.hashed_token), 'local confirmation token prepared');
    const confirmation = await pendingClient.auth.verifyOtp({ type: 'signup', token_hash: link.data.properties.hashed_token });
    check(!confirmation.error && Boolean(confirmation.data.session), 'email confirmation accepted by local Auth');
    await pendingClient.auth.signOut({ scope: 'local' });
    const confirmed = await pendingClient.auth.signInWithPassword({ email: emails[1], password });
    check(!confirmed.error && Boolean(confirmed.data.session), 'manual sign-in after confirmation succeeds');
    consentStore.set('pendingConsent', pendingConsent);
    const confirmedConsent = createConsentSync(consentStorage, url, row => pendingClient.from('user_consents').upsert(row));
    await confirmedConsent.prepare(emails[1]);
    await confirmedConsent.sync(confirmed.data.user.id, emails[1]);
    check(consentStore.size === 0, 'consent persists after confirmed-account login');
    const forged = await pendingClient.from('user_consents').upsert({ user_id: id,
      tos_version: 'forged', privacy_version: 'forged', source: 'app' });
    check(Boolean(forged.error), 'another account cannot overwrite consent');
    // Independent adapters model A -> logout -> B without sharing in-memory Auth state.
    const accountA = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } });
    clients.push(accountA);
    const loginA = await accountA.auth.signInWithPassword({ email: emails[0], password });
    check(!loginA.error, 'independent account A login');
    const catalog = await accountA.from('court_catalog').select('id').order('id').limit(2);
    check(!catalog.error && catalog.data.length === 2, 'existing catalog available for isolation fixtures');
    const joinedA = await accountA.from('court_memberships').insert({ user_id: id, court_id: catalog.data[0].id });
    const joinedB = await pendingClient.from('court_memberships').insert({ user_id: confirmed.data.user.id, court_id: catalog.data[1].id });
    check(!joinedA.error && !joinedB.error, 'separate membership fixtures');
    const courtsA = await loadMyCourts(accountA, id);
    const courtsB = await loadMyCourts(pendingClient, confirmed.data.user.id);
    check(courtsA.length === 1 && courtsA[0].court_id === catalog.data[0].id, 'My Courts returns only A membership');
    check(courtsB.length === 1 && courtsB[0].court_id === catalog.data[1].id, 'My Courts returns only B membership');
    check((await loadMyCourts(pendingClient, id)).length === 0, 'forged My Courts owner blocked by RLS');
    await accountA.auth.signOut({ scope: 'local' });
    await accountA.auth.signInWithPassword({ email: emails[0], password });
    check((await loadMyCourts(accountA, id))[0].court_id === catalog.data[0].id, 'return to A restores only A courts');
    const target = catalog.data[0].id;
    const joinedAt = (await loadMyCourts(accountA, id))[0].joined_at;
    await Promise.all([setCourtMembership(accountA, id, target, true), setCourtMembership(accountA, id, target, true)]);
    const repeated = await loadMyCourts(accountA, id);
    check(repeated.length === 1 && repeated[0].joined_at === joinedAt, 'duplicate/concurrent joins preserve one membership and timestamp');
    await setCourtMembership(accountA, id, target, false);
    await setCourtMembership(accountA, id, target, false);
    check((await loadMyCourts(accountA, id)).length === 0, 'leave and leave retry remove only own membership');
    check((await loadMyCourts(pendingClient, confirmed.data.user.id)).length === 1, 'A leaving does not alter B');
    await setCourtMembership(accountA, id, target, true);
    check((await loadMyCourts(accountA, id)).length === 1, 'rejoin succeeds');
    const restarted = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } });
    clients.push(restarted);
    await restarted.auth.signInWithPassword({ email: emails[0], password });
    check((await loadMyCourts(restarted, id))[0].court_id === target, 'fresh client restores membership');
    let rejected = false;
    try { await setCourtMembership(pendingClient, id, target, true); } catch { rejected = true; }
    check(rejected, 'membership helper rejects a mismatched owner');
    rejected = false;
    try { await setCourtMembership(accountA, id, randomUUID(), true); } catch { rejected = true; }
    check(rejected, 'nonexistent court cannot be joined');
    await restarted.auth.signOut({ scope: 'local' });

    await accountA.auth.signOut({ scope: 'local' });


    await pendingClient.auth.signOut({ scope: 'local' });
  } finally {
    for (const instance of clients) await instance.auth.stopAutoRefresh();
    await admin.auth.stopAutoRefresh();
    values.clear();
    const literals = emails.map(email => `'${email}'`).join(',');
    database(`BEGIN;
      DELETE FROM public.users_public WHERE id IN (SELECT id FROM auth.users WHERE email IN (${literals}));
      DELETE FROM auth.users WHERE email IN (${literals}); COMMIT;`);
    check(database(`SELECT count(*) FROM auth.users WHERE email IN (${literals});`).trim() === '0', 'fixture cleanup');
  }
  console.log(`PASS: ${checks} local Auth/session assertions. Fresh-client persistence uses an in-memory async adapter; native storage/device restart remain unverified.`);
}
