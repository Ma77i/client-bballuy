import { randomUUID } from 'node:crypto';

// This suite cannot target a hosted URL. Public keys and real user sessions are
// the only HTTP credentials; the SQL callback is restricted to fixtures/evidence.
export async function verifyAuthorization({ publicKey, database }) {
  const origin = 'http://127.0.0.1:55431';
  const emails = [randomUUID(), randomUUID()].map(id => `t03-${id}@example.invalid`);
  const accounts = [];
  let checks = 0;
  function check(condition, label) {
    if (!condition) throw new Error(`Authorization check failed: ${label}`);
    checks++;
  }
  async function request(route, { token, method = 'GET', body, prefer } = {}) {
    const response = await fetch(`${origin}/${route}`, {
      method, redirect: 'error', signal: AbortSignal.timeout(10000),
      headers: {
        apikey: publicKey, 'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(prefer ? { Prefer: prefer } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const text = await response.text();
    return { status: response.status, data: text ? JSON.parse(text) : null };
  }
  const api = (route, options) => request(`rest/v1/${route}`, options);
  const denied = (result, label) => check([401, 403].includes(result.status), `${label} (HTTP ${result.status})`);
  const mutation = (token, method, body) => ({ token, method, body, prefer: 'return=representation' });
  const preservedCourts = database('SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM public.courts c;');
  try {
    for (const email of emails) {
      const result = await request('auth/v1/signup', {
        method: 'POST', body: {
          email, password: `${randomUUID()}Aa1!`,
          data: { display_name: 'T03 fixture', app_role: 'admin', level: 999 },
        },
      });
      check(result.status === 200 && Boolean(result.data?.access_token), 'local signup returns a session');
      check(/^[0-9a-f-]{36}$/.test(result.data.user.id), 'fixture identity is a UUID');
      accounts.push({ id: result.data.user.id, token: result.data.access_token });
    }
    const [a, b] = accounts;
    async function profile(account) {
      const result = await api(`users_public?id=eq.${account.id}&select=*`, { token: account.token });
      check(result.status === 200 && result.data.length === 1, 'owner can read profile');
      return result.data[0];
    }
    const beforeA = await profile(a);
    const beforeB = await profile(b);
    check(beforeA.app_role === 'player' && beforeB.app_role === 'player' && beforeA.level !== 999,
      'signup metadata cannot grant a global role or statistics');
    const update = await api(`users_public?id=eq.${a.id}`, mutation(a.token, 'PATCH', {
      display_name: 'T03 updated', avatar_url: null, discoverable: false,
      profile_visibility: 'private', location_mode: 'approx',
    }));
    check(update.status === 200 && update.data.length === 1, 'allowed own profile fields update');
    check((await profile(a)).display_name === 'T03 updated', 'allowed update persists');
    const protectedFields = {
      app_role: 'admin', id: b.id, created_at: '2000-01-01T00:00:00Z',
      level: 999, games_played: 999, points_total: 999, assists_total: 999, rebounds_total: 999,
    };
    for (const [column, value] of Object.entries(protectedFields)) {
      denied(await api(`users_public?id=eq.${a.id}`, mutation(a.token, 'PATCH', { [column]: value })),
        `protected profile column ${column}`);
      check((await profile(a))[column] === beforeA[column], `protected ${column} unchanged`);
    }
    for (const token of [a.token, undefined]) {
      denied(await api('users_public', mutation(token, 'POST', { id: randomUUID(), app_role: 'admin' })),
        'direct profile insert denied');
      denied(await api('users_public?on_conflict=id', {
        ...mutation(token, 'POST', { id: a.id, display_name: 'Overwrite', app_role: 'admin' }),
        prefer: 'resolution=merge-duplicates,return=representation',
      }), 'profile upsert denied');
      denied(await api(`users_public?id=eq.${a.id}`, mutation(token, 'DELETE')), 'profile delete denied');
    }
    const crossProfile = await api(`users_public?id=eq.${b.id}`, mutation(a.token, 'PATCH', { display_name: 'Wrong owner' }));
    check(crossProfile.status === 200 && crossProfile.data.length === 0, 'cross-account profile update affects no rows');
    denied(await api(`users_public?id=eq.${a.id}`, mutation(undefined, 'PATCH', { display_name: 'Anonymous' })),
      'anonymous profile update denied');
    check(JSON.stringify(await profile(b)) === JSON.stringify(beforeB), 'other profile preserved');

    const courts = await api('courts?select=id&order=id');
    check(courts.status === 200 && courts.data.length === 3, 'public court catalog remains readable');
    const [first, second, third] = courts.data.map(row => row.id);
    for (const token of [undefined, a.token, b.token]) {
      for (const relation of ['courts', 'court_catalog']) {
        const read = await api(`${relation}?select=id`, { token });
        check(read.status === 200 && read.data.length === 3, `${relation} readable`);
        denied(await api(`${relation}?id=eq.${first}`, mutation(token, 'PATCH', { name: 'Unauthorized' })),
          `${relation} update denied`);
        denied(await api(`${relation}?id=eq.${first}`, mutation(token, 'DELETE')), `${relation} delete denied`);
        const body = relation === 'courts'
          ? { id: randomUUID(), name: 'Unauthorized', coords: 'SRID=4326;POINT(-56 -34)' }
          : { id: randomUUID(), name: 'Unauthorized' };
        denied(await api(relation, mutation(token, 'POST', body)), `${relation} insert denied`);
      }
    }
    const join = (account, court, extra = {}) => api('court_memberships', mutation(account.token, 'POST', {
      user_id: account.id, court_id: court, ...extra,
    }));
    const list = async account => {
      const result = await api('court_memberships?select=*&order=court_id', { token: account.token });
      check(result.status === 200 && result.data.every(row => row.user_id === account.id), 'membership reads stay owner-scoped');
      return result.data;
    };
    check((await join(b, first)).status === 201, 'B joins court');
    const firstJoin = await join(a, first);
    check(firstJoin.status === 201 && Math.abs(Date.now() - Date.parse(firstJoin.data[0].joined_at)) < 60000,
      'A independently joins with server timestamp');
    check((await join(a, first)).status === 409, 'duplicate join rejected');
    check((await join(a, randomUUID())).status === 409, 'nonexistent court rejected');
    denied(await join(a, second, { user_id: b.id }), 'forged membership owner rejected');
    denied(await join(a, second, { joined_at: '2000-01-01T00:00:00Z' }), 'forged joined timestamp rejected');
    for (const token of [a.token, undefined]) {
      denied(await api(`court_memberships?user_id=eq.${a.id}`, mutation(token, 'PATCH', { user_id: b.id })),
        'membership owner update denied');
      denied(await api(`court_memberships?user_id=eq.${a.id}`, mutation(token, 'PATCH', { court_id: second })),
        'membership court update denied');
      denied(await api(`court_memberships?user_id=eq.${a.id}`, mutation(token, 'PATCH', { joined_at: '2000-01-01T00:00:00Z' })),
        'membership timestamp update denied');
    }
    denied(await api('court_memberships'), 'anonymous membership listing denied');
    denied(await api('court_memberships', mutation(undefined, 'POST', { user_id: a.id, court_id: second })),
      'anonymous join denied');
    denied(await api(`court_memberships?user_id=eq.${a.id}`, mutation(undefined, 'DELETE')), 'anonymous leave denied');
    const foreignRead = await api(`court_memberships?user_id=eq.${b.id}`, { token: a.token });
    check(foreignRead.status === 200 && foreignRead.data.length === 0, 'A cannot list B memberships');
    const foreignDelete = await api(`court_memberships?user_id=eq.${b.id}`, mutation(a.token, 'DELETE'));
    check(foreignDelete.status === 200 && foreignDelete.data.length === 0, 'A cannot remove B memberships');
    check((await list(b)).length === 1, 'B membership survives denied mutations');
    check((await list(a)).length === 1, 'denied joins and updates leave A unchanged');
    check((await join(a, second)).status === 201, 'A joins another court without a team');
    const concurrent = await Promise.all([join(a, third), join(a, third)]);
    check(concurrent.map(r => r.status).sort().join(',') === '201,409', 'concurrent joins create only one row');
    check((await list(a)).length === 3, 'one membership per court');
    const leave = await api(`court_memberships?court_id=eq.${first}`, mutation(a.token, 'DELETE'));
    check(leave.status === 200 && leave.data.length === 1, 'A leaves own membership only');
    check((await list(a)).length === 2 && (await list(b)).length === 1, 'leave preserves other courts and B');
    const leaveAgain = await api(`court_memberships?court_id=eq.${first}`, mutation(a.token, 'DELETE'));
    check(leaveAgain.status === 200 && leaveAgain.data.length === 0, 'repeat leave is harmless');
    check((await join(a, first)).status === 201, 'A rejoins');
    const broadDelete = await api('court_memberships?user_id=not.is.null', mutation(a.token, 'DELETE'));
    check(broadDelete.status === 200 && broadDelete.data.length === 3, 'broad delete affects only own memberships');
    check((await list(b)).length === 1 && (await list(a)).length === 0, 'ownership survives broad mutation');
    check((await profile(a)).app_role === 'player' && (await profile(b)).app_role === 'player', 'global roles remain unchanged');
    check(database(`SELECT count(*) FROM public.team_members WHERE user_id IN ('${a.id}', '${b.id}');`).trim() === '0',
      'membership operations require no team');
    check(database('SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM public.courts c;') === preservedCourts,
      'all original court fields preserved');
  } finally {
    // Addresses are generated here, never accepted from arguments or .env.
    const literals = emails.map(email => `'${email}'`).join(',');
    database(`BEGIN;
      DELETE FROM public.users_public WHERE id IN (SELECT id FROM auth.users WHERE email IN (${literals}));
      DELETE FROM auth.users WHERE email IN (${literals});
      COMMIT;`);
    check(database(`SELECT count(*) FROM auth.users WHERE email IN (${literals});`).trim() === '0',
      'fixture Auth users removed');
    if (accounts.length) {
      const ids = accounts.map(account => `'${account.id}'`).join(',');
      check(database(`SELECT (SELECT count(*) FROM public.users_public WHERE id IN (${ids}))
        + (SELECT count(*) FROM public.court_memberships WHERE user_id IN (${ids}));`).trim() === '0',
      'fixture profiles and memberships removed');
    }
  }
  console.log(`PASS: ${checks} authorization assertions using anonymous access and two real local Auth sessions; fixtures removed.`);
}
