import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Fixed disposable origin; never load .env or accept a caller-supplied endpoint.
export async function verifyPickup({ publicKey, database }) {
  const emails = [randomUUID(), randomUUID()].map(id => `pickup-${id}@example.invalid`);
  const accounts = [];
  let checks = 0;
  const check = (condition, label) => {
    if (!condition) throw new Error(`Pickup check failed: ${label}`);
    checks++;
  };
  const before = database('SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM public.courts c;');
  async function request(route, { account, method = 'GET', body } = {}) {
    const response = await fetch(`http://127.0.0.1:55431/${route}`, {
      method, redirect: 'error', signal: AbortSignal.timeout(15000),
      headers: { apikey: publicKey, 'Content-Type': 'application/json',
        ...(account ? { Authorization: `Bearer ${account.token}` } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const text = await response.text();
    return { status: response.status, data: text ? JSON.parse(text) : null };
  }
  const api = (route, options) => request(`rest/v1/${route}`, options);
  const command = (account, action, data, key = randomUUID()) => api('rpc/pickup_command', {
    account, method: 'POST', body: { p_request_id: key, p_action: action, p_data: data },
  });
  const good = (r, label) => { check(r.status === 200, label); return r.data; };
  const bad = (r, label) => check(r.status >= 400 && r.status < 500, label);
  const future = new Date(Date.now() + 86400000).toISOString();
  // Replay only the new contract inside a rollback transaction. Existing local
  // data is restored by ROLLBACK; no baseline or hosted reset is involved.
  const migration = readFileSync(new URL('../supabase/migrations/20261012000100_pickup_contract.sql', import.meta.url), 'utf8')
    .replace(/^BEGIN;\r?$/m, '').replace(/^COMMIT;\r?$/m, '');
  const matchMigration = readFileSync(new URL('../supabase/migrations/20261013000100_match_recording.sql', import.meta.url), 'utf8')
    .replace(/^BEGIN;\r?$/m, '').replace(/^COMMIT;\r?$/m, '');
  const replay = database(`BEGIN;
    DROP FUNCTION public.pickup_command(uuid,text,jsonb,uuid);
    DROP TABLE public.pickup_score_history,public.pickup_match_players,public.pickup_matches,
      public.pickup_places,public.pickup_sessions CASCADE;
    DROP SCHEMA pickup_private CASCADE;
    ${migration}
    DROP FUNCTION public.pickup_player_search(text);
    ${matchMigration}
    SELECT count(*) FROM information_schema.tables WHERE table_schema='public'
      AND table_name IN ('pickup_sessions','pickup_places','pickup_matches','pickup_match_players','pickup_score_history');
    ROLLBACK;`);
  check(replay.trim() === '5', 'fresh pickup migration replays in rollback without resetting existing data');
  check(database(`SELECT has_function_privilege('authenticated','public.pickup_command(uuid,text,jsonb,uuid)','EXECUTE')
    AND NOT has_function_privilege('anon','public.pickup_command(uuid,text,jsonb,uuid)','EXECUTE')
    AND NOT has_schema_privilege('authenticated','pickup_private','USAGE')
    AND NOT has_function_privilege('authenticated','pickup_private.integer_value(jsonb)','EXECUTE');`).trim() === 't',
  'RPC execute restricted and internal helper/receipts inaccessible');
  try {
    for (const email of emails) {
      const r = await request('auth/v1/signup', { method: 'POST', body: {
        email, password: `${randomUUID()}Aa1!`, data: { display_name: 'Pickup fixture' },
      } });
      check(r.status === 200 && Boolean(r.data?.access_token), 'local signup');
      accounts.push({ id: r.data.user.id, token: r.data.access_token });
    }
    const [a, b] = accounts;
    bad(await api('rpc/pickup_player_search', { method:'POST', body:{p_search:'Pickup'} }), 'anonymous player lookup denied');
    const search = good(await api('rpc/pickup_player_search', { account:b, method:'POST', body:{p_search:'Pickup'} }), 'authenticated bounded player lookup');
    check(search.some(row => row.id === a.id) && search.length <= 20 && search.every(row => Object.keys(row).sort().join(',') === 'display_name,id'),
      'player lookup exposes only safe IDs/names');
    check(good(await api('rpc/pickup_player_search', { account:b, method:'POST', body:{p_search:'%'} }), 'literal player search').length === 0,
      'short/wildcard input cannot dump account names');
    const courts = good(await api('courts?select=id&order=id'), 'preserved catalog');
    const court = courts[0].id;
    const create = (account, overrides = {}, key) => command(account, 'create_session', {
      court_id: court, format: '2v2', timing: 'now', organizer_plays: false,
      present_count: 2, ...overrides,
    }, key);
    const list = async (relation, filter = '', account = b) =>
      good(await api(`${relation}?select=*${filter}`, { account }), `${relation} authenticated read`);

    for (const relation of ['pickup_sessions','pickup_places','pickup_matches','pickup_match_players',
      'pickup_score_history','pickup_session_catalog','pickup_roster','pickup_match_roster']) {
      bad(await api(`${relation}?select=*`), `${relation} anonymous denied`);
      const directBody = ['pickup_sessions','pickup_matches','pickup_session_catalog'].includes(relation)
        ? { state: 'cancelled' } : relation === 'pickup_score_history' ? { score_a: 99 } : { guest_label: 'Unauthorized' };
      for (const method of ['POST','PATCH','DELETE']) {
        const mutation = await api(relation, { account: a, method, ...(method === 'DELETE' ? {} : { body: directBody }) });
        check((mutation.status >= 400 && mutation.status < 500) ||
          (mutation.status === 500 && mutation.data?.code === '55000'),
          `${relation} direct ${method} denied (HTTP ${mutation.status}, code ${mutation.data?.code})`);
      }
    }
    bad(await command(undefined, 'create_session', {}), 'anonymous RPC denied');
    bad(await api('rpc/pickup_command', { account:b, method:'POST', body:{
      p_request_id:randomUUID(), p_action:'create_session', p_expected_actor:a.id,
      p_data:{court_id:court,format:'1v1',timing:'now',organizer_plays:false,present_count:0},
    } }), 'identity change between client check and RPC cannot write as another account');
    bad(await api('rpc/integer_value', { account: a, method: 'POST', body: { value: 1 } }), 'private helper not exposed');
    const key = randomUUID();
    const session = good(await create(a, {}, key), 'create immediate with guests');
    check(good(await create(a, {}, key), 'create replay').id === session.id, 'one creation after uncertain response');
    bad(await create(a, { present_count: 1 }, key), 'changed receipt payload denied');
    bad(await create(a, { organizer_id: b.id }), 'forged organizer denied');
    bad(await create(a, { created_at: future }), 'forged timestamp denied');
    bad(await create(a, { format: '3v3' }), 'unsupported format denied');
    bad(await create(a, { present_count: 5 }), 'guest overcapacity denied');
    bad(await create(a, { present_count: -1 }), 'negative occupancy denied');
    bad(await create(a, { present_count: 1.5 }), 'fractional occupancy denied');
    bad(await create(a, { organizer_plays: true, present_count: 0 }), 'missing organizer place denied');
    bad(await create(a, { court_id: randomUUID() }), 'unknown court denied');
    bad(await create(a, { timing: 'future', scheduled_at: '2000-01-01T00:00:00Z' }), 'past future time denied');
    let catalog = await list('pickup_session_catalog', `&id=eq.${session.id}`);
    check(catalog[0].occupied_places === 2 && catalog[0].available_places === 2, 'two present leave two available');
    check(catalog[0].organizer_name === 'Pickup fixture', 'safe other-account organizer display');
    check(!Object.keys(catalog[0]).some(k => ['email','app_role','avatar_url'].includes(k)), 'no profile fields leaked');
    const joinKey = randomUUID();
    good(await command(b, 'join', { session_id: session.id }, joinKey), 'B joins without court membership');
    good(await command(b, 'join', { session_id: session.id }, joinKey), 'lost join response retry');
    good(await command(b, 'join', { session_id: session.id }), 'duplicate join no-op');
    check((await list('pickup_places', `&session_id=eq.${session.id}`)).length === 3, 'one B registration');
    good(await command(a, 'join', { session_id: session.id }), 'organizer explicitly registers');
    check((await list('pickup_sessions', `&id=eq.${session.id}`))[0].organizer_plays === true,
      'organizer participation follows actual account place');
    check((await list('pickup_session_catalog', `&id=eq.${session.id}`))[0].available_places === 0, 'full session');
    const roster = await list('pickup_roster', `&session_id=eq.${session.id}`);
    check(roster.filter(p => p.user_id).every(p => p.display_name === 'Pickup fixture'), 'authenticated roster names');
    bad(await command(b, 'leave', { session_id: session.id, user_id: a.id }), 'forged leave owner denied');
    const leaveKey = randomUUID();
    good(await command(b, 'leave', { session_id: session.id }, leaveKey), 'B leaves before start');
    check(!(await list('pickup_roster', `&user_id=eq.${b.id}`, b)).some(row => row.session_id === session.id),
      'leaving removes the caller from the safe personal-registration projection');
    good(await command(b, 'join', { session_id: session.id }), 'B rejoins');
    good(await command(b, 'leave', { session_id: session.id }, leaveKey), 'old leave receipt replay');
    check((await list('pickup_places', `&session_id=eq.${session.id}&user_id=eq.${b.id}`)).length === 1,
      'old leave retry does not undo new join');
    bad(await command(b, 'start', { session_id: session.id }), 'non-owner cannot start');
    bad(await command(b, 'cancel', { session_id: session.id }), 'non-owner cannot cancel');
    bad(await command(a, 'edit_session', { session_id: session.id, scheduled_at: future }), 'registered core edit denied');
    good(await command(a, 'start', { session_id: session.id }), 'owner starts');
    const reported = (await list('pickup_session_catalog', `&id=eq.${session.id}`, b))[0];
    check(reported.state === 'started' && Number.isFinite(Date.parse(reported.started_at)),
      'other authenticated player sees organizer-reported start with server time');
    check((await list('pickup_session_catalog', `&state=eq.started&court_id=eq.${court}`, b)).some(row => row.id === session.id),
      'court activity is visible without court membership');
    bad(await command(b, 'leave', { session_id: session.id }), 'leave after start denied');
    bad(await command(b, 'join', { session_id: session.id }), 'join after start denied');
    bad(await command(a, 'cancel', { session_id: session.id }), 'started cancellation denied');
    good(await command(a, 'complete_session', { session_id: session.id }), 'completion independent of match result');
    check(!(await list('pickup_session_catalog', '&state=in.(open,started)', b)).some(row => row.id === session.id),
      'closed invitation disappears from discovery and reported activity');
    check((await list('pickup_session_catalog', `&id=eq.${session.id}`, b))[0].state === 'completed',
      'completed direct public detail retains actual state');
    check((await list('pickup_matches', `&source_session_id=eq.${session.id}`)).length === 0, 'completion invents no match/result');

    for (const [format, capacity] of [['1v1',2],['2v2',4],['5v5',10]]) {
      const full = good(await create(a, { format, present_count: capacity, organizer_plays: true }), `${format} capacity`);
      catalog = await list('pickup_session_catalog', `&id=eq.${full.id}`);
      check(catalog[0].occupied_places === capacity && catalog[0].available_places === 0, 'organizer not counted twice');
      bad(await command(b, 'join', { session_id: full.id }), 'full format denies join');
    }
    const race = good(await create(a, { format: '1v1', present_count: 1 }), 'last-slot race fixture');
    const competing = await Promise.all([a,b].map(account => command(account, 'join', { session_id: race.id })));
    check(competing.filter(r => r.status === 200).length === 1, 'only one caller gets last place');
    check((await list('pickup_places', `&session_id=eq.${race.id}`)).length === 2, 'last slot race never overbooks');
    const startRace = good(await create(a, { format: '1v1', present_count: 0 }), 'start race fixture');
    const raced = await Promise.all([command(a, 'start', { session_id: startRace.id }), command(b, 'join', { session_id: startRace.id })]);
    good(raced[0], 'start race starts');
    check(raced[1].status === 200 || raced[1].status === 409, 'join ordered before or after start');
    const countAtStart = (await list('pickup_places', `&session_id=eq.${startRace.id}`)).length;
    bad(await command(b, 'join', { session_id: startRace.id }), 'later join always rejected');
    check((await list('pickup_places', `&session_id=eq.${startRace.id}`)).length === countAtStart, 'no mutation after start');
    const upcoming = good(await create(b, { timing: 'future', scheduled_at: future, present_count: 1, organizer_plays: true }), 'B future with organizer');
    good(await command(a, 'join', { session_id: upcoming.id }), 'A joins future');
    good(await command(b, 'cancel', { session_id: upcoming.id }), 'B cancels own future');
    check((await list('pickup_places', `&session_id=eq.${upcoming.id}`, a)).length === 2, 'cancel retains registrations');
    check((await list('pickup_sessions', `&id=eq.${upcoming.id}`, a))[0].state === 'cancelled', 'cancellation visible');
    check((await list('pickup_roster', `&user_id=eq.${a.id}`, a)).some(row => row.session_id === upcoming.id),
      'cancelled invitation remains discoverable through the caller registration');
    check((await list('pickup_session_catalog', `&organizer_id=eq.${b.id}`, b)).some(row => row.id === upcoming.id && row.state === 'cancelled'),
      'organizer personal projection retains cancelled invitations');
    bad(await command(a, 'join', { session_id: upcoming.id }), 'cancelled join denied');
    const past = good(await create(a, { timing: 'future', scheduled_at: future, present_count: 0 }), 'planned clock fixture');
    database(`UPDATE public.pickup_sessions SET scheduled_at=now()-interval '1 hour' WHERE id='${past.id}';`);
    good(await command(b, 'join', { session_id: past.id }), 'planned time alone does not start');
    good(await command(a, 'edit_session', { session_id: past.id, description:'Updated after planned time' }),
      'open description remains editable after planned time');
    const editable = good(await create(a, { present_count: 0 }), 'empty editable fixture');
    good(await command(a, 'edit_session', { session_id: editable.id, court_id: courts[1].id, format: '5v5' }), 'empty session core edit');
    good(await command(a, 'join', { session_id: editable.id }), 'organizer joins empty session');
    good(await command(a, 'leave', { session_id: editable.id }), 'organizer leaves before start');
    check((await list('pickup_sessions', `&id=eq.${editable.id}`))[0].organizer_plays === false,
      'organizer leaving releases playing choice and place');
    bad(await command(a, 'edit_session', { session_id: editable.id, format:'1v1' }),
      'core remains locked after everyone leaves');

    const players = [{ side: 'A', user_id: a.id }, { side: 'B', guest_label: 'Guest fixture' }];
    const matchInput = { court_id: court, format: '1v1', players };
    const matchKey = randomUUID();
    const match = good(await command(a, 'create_match', matchInput, matchKey), 'assembled match with guest');
    check(good(await command(a, 'create_match', matchInput, matchKey), 'match retry').id === match.id, 'match creation idempotent');
    bad(await command(a, 'create_match', { ...matchInput, players: players.slice(0,1) }), 'incomplete sides denied');
    bad(await command(a, 'create_match', { ...matchInput, players: [{ side:'A',user_id:a.id },{ side:'B',user_id:a.id }] }), 'duplicate player denied');
    bad(await command(a, 'create_match', { ...matchInput, players: [{ side:'A',user_id:a.id,guest_label:'Guest' },players[1]] }), 'mixed guest/account denied');
    bad(await command(b, 'create_match', { ...matchInput, source_session_id: session.id }), 'foreign source denied');
    const history = () => list('pickup_score_history', `&match_id=eq.${match.id}&order=revision`);
    const score = (account, rev, x, y, requestKey) => command(account, 'score', {
      match_id: match.id, expected_revision: rev, score_a: x, score_b: y,
    }, requestKey);
    bad(await score(b,0,11,8), 'other user cannot record result');
    bad(await score(a,0,-1,8), 'negative score denied');
    bad(await score(a,0,1.5,8), 'fractional score denied');
    bad(await score(a,0,'11',8), 'string score denied');
    check((await history()).length === 0, 'invalid writes create no history');
    const scoreKey = randomUUID();
    const closed = good(await score(a,0,11,8,scoreKey), 'first final score');
    check(closed.state === 'completed' && closed.revision === 1 && Boolean(closed.closed_at), 'score closes atomically');
    good(await score(a,0,11,8,scoreKey), 'lost score response retry');
    check((await history()).length === 1, 'retry no duplicate history');
    const corrected = good(await score(a,1,12,8), 'organizer correction');
    check(corrected.state === 'completed' && corrected.closed_at === closed.closed_at, 'correction stays closed');
    const revisions = await history();
    check(revisions.length === 2 && revisions[1].previous_a === 11 && revisions[1].score_a === 12, 'old and new score retained');
    bad(await score(a,1,13,8), 'stale revision denied');
    const scoreRace = await Promise.all([score(a,2,14,8),score(a,2,15,8)]);
    check(scoreRace.filter(r => r.status === 200).length === 1, 'one concurrent correction wins');
    check((await history()).length === 3, 'concurrent correction creates one revision');
    good(await score(a,0,11,8,scoreKey), 'old result receipt replay');
    check((await history()).length === 3, 'old retry cannot revert corrected result');
    const currentMatch = (await list('pickup_matches', `&id=eq.${match.id}`))[0];
    check(currentMatch.revision === 3 && [14,15].includes(currentMatch.score_a), 'latest result survives old receipt replay');
    for (const [format, perSide] of [['2v2',2],['5v5',5]]) {
      const guests = ['A','B'].flatMap(side => Array.from({ length: perSide }, (_,i) => ({ side, guest_label: `Guest ${side}${i}` })));
      good(await command(b, 'create_match', { court_id: court, format, players: guests }), `${format} all guest match`);
    }
    const linkedPlayers = [...players, { side:'A',guest_label:'Guest A' },{ side:'B',guest_label:'Guest B' }];
    const linked = good(await command(a, 'create_match', {
      ...matchInput, format:'2v2', players:linkedPlayers, source_session_id: session.id,
    }), 'match linked to started/closed invitation');
    check(linked.source_session_id === session.id, 'source preserved');
    const activeSource = good(await create(a, { format:'1v1',present_count:2 }), 'active match source');
    good(await command(a,'start',{session_id:activeSource.id}), 'start source before recording');
    const activeMatch = good(await command(a,'create_match',{...matchInput,source_session_id:activeSource.id}), 'record active source match');
    const finalKey = randomUUID();
    const finalData = {match_id:activeMatch.id,expected_revision:0,score_a:11,score_b:9};
    good(await command(a,'score',finalData,finalKey), 'final result closes linked activity');
    const sourceClosed = (await list('pickup_sessions',`&id=eq.${activeSource.id}`))[0];
    check(sourceClosed.state==='completed' && Boolean(sourceClosed.closed_at), 'score closes source invitation atomically');
    good(await command(a,'score',{...finalData,expected_revision:1,score_a:12}), 'linked correction');
    good(await command(a,'score',finalData,finalKey), 'linked final result replay');
    const sourceAfter = (await list('pickup_sessions',`&id=eq.${activeSource.id}`))[0];
    check(sourceAfter.state==='completed' && sourceAfter.closed_at===sourceClosed.closed_at,
      'correction/replay never reopens source or changes closure time');
    check((await list('pickup_score_history',`&match_id=eq.${activeMatch.id}`)).length===2, 'linked replay adds no history row');
    check(database(`SELECT count(*) FROM public.court_memberships WHERE user_id IN ('${a.id}','${b.id}');`).trim() === '0', 'no court-follow prerequisite');
    check(database(`SELECT count(*) FROM public.team_members WHERE user_id IN ('${a.id}','${b.id}');`).trim() === '0', 'no team prerequisite');
    check(database(`SELECT count(*) FROM public.users_public WHERE id IN ('${a.id}','${b.id}') AND (app_role<>'player' OR games_played<>0 OR points_total<>0);`).trim() === '0', 'roles and statistics untouched');
    check(database('SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM public.courts c;') === before, 'all original court fields preserved');
  } finally {
    const identities = emails.map(email => `'${email}'`).join(',');
    database(`BEGIN;
      DELETE FROM public.pickup_matches WHERE organizer_id IN (SELECT id FROM auth.users WHERE email IN (${identities}));
      DELETE FROM public.pickup_sessions WHERE organizer_id IN (SELECT id FROM auth.users WHERE email IN (${identities}));
      DELETE FROM public.users_public WHERE id IN (SELECT id FROM auth.users WHERE email IN (${identities}));
      DELETE FROM auth.users WHERE email IN (${identities}); COMMIT;`);
    check(database(`SELECT count(*) FROM auth.users WHERE email IN (${identities});`).trim() === '0', 'generated fixtures removed');
  }
  console.log(`PASS: ${checks} pickup assertions using anonymous access and two real local Auth sessions; fixtures removed.`);
}
