const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { defaultSessionDraft, validateSessionDraft, restoredSessionDraft, createOrganizerRequestManager,
  executeOrganizerCommand, managementActions } = require('../lib/pickup/organizer.ts');
const owner = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const court = '33333333-3333-4333-8333-333333333333';
const gameId = '44444444-4444-4444-8444-444444444444';
const input = { action: 'create_session', data: { court_id: court, format: '2v2', timing: 'now', organizer_plays: true, present_count: 2 } };

function fixture() {
  const rows = new Map(), saved = new Map(), receipts = new Map(), keys = [];
  const state = { authOwner: owner, loseResponse: false, readFailure: false, rejectCode: null, failSave: false, failRemove: false, authFailure: false, switchOnRpc:false };
  const client = { auth: { getUser: async () => ({ data: { user: { id: state.authOwner } }, error: state.authFailure ? new Error('offline') : null }) },
    rpc: async (_, args) => {
      keys.push(args.p_request_id);
      if (state.switchOnRpc) state.authOwner=other;
      if (args.p_expected_actor !== state.authOwner) return { data:null,error:{code:'42501',message:'Caller identity changed'} };
      if (state.rejectCode) return { data: null, error: { code: state.rejectCode } };
      if (!receipts.has(args.p_request_id)) {
        const row = { id: gameId, organizer_id: owner, court_id: court, format:'2v2', capacity:4,
          timing:'now', scheduled_at:new Date().toISOString(), description:'', organizer_plays:true, core_locked:true,
          state:'open', created_at:new Date().toISOString(), started_at:null, closed_at:null, pickup_places:[{id:'place'}] };
        rows.set(gameId, row); receipts.set(args.p_request_id, { id: gameId });
      }
      if (state.loseResponse) { state.loseResponse = false; throw new Error('Lost response'); }
      return { data: receipts.get(args.p_request_id), error:null };
    },
    from: () => {
      const filters = {};
      const q = { select(){return q;},eq(key,value){filters[key]=value;return q;},abortSignal(){return q;},
        maybeSingle: async () => ({ data: [...rows.values()].find(row=>row.id===filters.id&&row.organizer_id===filters.organizer_id) ?? null,
          error:state.readFailure?new Error('read failed'):null }) };
      return q;
    },
  };
  const storage = { getItem:async key=>saved.get(key)??null,
    setItem:async(key,value)=>{if(state.failSave)throw new Error('Storage failed');saved.set(key,value);},
    removeItem:async key=>{if(state.failRemove)throw new Error('Storage failed');saved.delete(key);} };
  const manager = (overrides={})=>createOrganizerRequestManager({ client,storage,owner,backend:'local',scope:'create',makeId:randomUUID,...overrides });
  return { state, client, storage, manager, saved, receipts, rows, keys };
}
test('format capacity and participation validate combined places, not only app registrations', () => {
  const draft = { ...defaultSessionDraft(court), presentCount:'2' };
  assert.deepEqual(validateSessionDraft(draft).errors, {});
  assert.equal(validateSessionDraft(draft).data.present_count, 2);
  for (const value of ['-1','1.5','5','']) assert.ok(validateSessionDraft({...draft,presentCount:value}).errors.presentCount);
  assert.ok(validateSessionDraft({...draft,presentCount:'0'}).errors.presentCount);
  assert.equal(validateSessionDraft({...draft,organizerPlays:false,presentCount:'0'}).data.present_count,0);
  assert.equal(validateSessionDraft({...draft,timing:'future',presentCount:'9',date:'2099-01-01',time:'18:00'}).data.present_count,1);
});
test('calendar rollover, invalid clock time and past schedules never become valid future invites', () => {
  const draft = {...defaultSessionDraft(court),timing:'future',date:'2099-02-28',time:'18:00'};
  assert.deepEqual(validateSessionDraft(draft).errors,{});
  assert.ok(validateSessionDraft({...draft,date:'2099-02-29'}).errors.date);
  assert.ok(validateSessionDraft({...draft,date:'2099-04-31'}).errors.date);
  assert.ok(validateSessionDraft({...draft,time:'24:00'}).errors.time);
  assert.ok(validateSessionDraft({...draft,time:'18:99'}).errors.time);
  assert.ok(validateSessionDraft({...draft,date:'2000-01-01'}).errors.time);
  assert.ok(validateSessionDraft({...draft,courtId:''}).errors.courtId);
  assert.ok(validateSessionDraft({...draft,description:'x'.repeat(501)}).errors.description);
});
test('restored pending creation shows the saved court, participation and local planned time', () => {
  const time = new Date(2099,0,1,19,30);
  const restored = restoredSessionDraft({...input.data,timing:'future',scheduled_at:time.toISOString(),description:'Retained note'},defaultSessionDraft());
  assert.equal(restored.courtId,court);assert.equal(restored.date,'2099-01-01');assert.equal(restored.time,'19:30');assert.equal(restored.description,'Retained note');
});
test('lost create response persists the same key across a fresh manager without duplicate games', async () => {
  const f=fixture();f.state.loseResponse=true;const first=f.manager();
  await assert.rejects(first.send(input),/could not confirm/);
  assert.equal(f.saved.size,1);assert.equal(f.receipts.size,1);
  const remounted=f.manager();await remounted.load();
  const result=await remounted.send();
  assert.equal(result.id,gameId);assert.equal(f.receipts.size,1);assert.equal(f.saved.size,0);
  assert.equal(f.keys[0],f.keys[1]);
});
test('failed readback retains the request until current server state can be confirmed', async () => {
  const f=fixture();f.state.readFailure=true;const manager=f.manager();
  await assert.rejects(manager.send(input),/may be saved/);assert.equal(f.saved.size,1);
  f.state.readFailure=false;
  f.rows.get(gameId).state='started';
  assert.equal((await manager.send()).state,'started');assert.equal(f.receipts.size,1);
});
test('storage failure prevents sending and cleanup failure after success remains safely retryable', async () => {
  const f=fixture();const manager=f.manager();f.state.failSave=true;
  await assert.rejects(manager.send(input),/device/);assert.equal(f.keys.length,0);
  f.state.failSave=false;f.state.failRemove=true;
  await assert.rejects(manager.send(),/saved/);assert.equal(f.receipts.size,1);
  f.state.failRemove=false;await manager.send();assert.equal(f.receipts.size,1);assert.equal(f.saved.size,0);
});
test('two presses share one in-flight request', async () => {
  const f=fixture();const manager=f.manager();await Promise.all([manager.send(input),manager.send(input)]);
  assert.equal(f.keys.length,1);assert.equal(f.receipts.size,1);
});
test('definite server rejection permits fixing input while auth failure never discards an uncertain operation', async () => {
  const f=fixture();const manager=f.manager();f.state.rejectCode='PT409';
  await assert.rejects(manager.send(input),/changed/);assert.equal(f.saved.size,0);assert.equal(manager.pending,null);
  f.state.rejectCode=null;f.state.loseResponse=true;await assert.rejects(manager.send(input));
  f.state.authFailure=true;await assert.rejects(manager.send(),/session/);assert.equal(f.saved.size,1);
  f.state.authFailure=false;await manager.send();assert.equal(f.receipts.size,1);
});
test('account/backend/session scope isolation rejects stale pending requests and identity changes before RPC', async () => {
  const f=fixture();const manager=f.manager();f.state.loseResponse=true;await assert.rejects(manager.send(input));
  const b=f.manager({owner:other});assert.equal(await b.load(),null);
  const remote=f.manager({backend:'another'});assert.equal(await remote.load(),null);
  const detail=f.manager({scope:gameId});assert.equal(await detail.load(),null);
  const before=f.keys.length;f.state.authOwner=other;await assert.rejects(manager.send(),/session/);
  assert.equal(f.keys.length,before);assert.equal(f.saved.size,1);
  f.state.authOwner=owner;await manager.send();
});
test('management actions follow confirmed lifecycle and never unlock court/time/format after someone joined', () => {
  const open={state:'open',core_locked:true};assert.equal(managementActions(open).editCore,false);
  assert.equal(managementActions(open).start,true);
  assert.equal(managementActions({state:'started',core_locked:true}).cancel,false);
  assert.equal(managementActions({state:'completed',core_locked:true}).edit,false);
  assert.equal(managementActions({state:'cancelled',core_locked:true}).start,false);
});
test('mismatched authenticated owner never submits a command', async () => {
  const f=fixture();f.state.authOwner=other;
  await assert.rejects(executeOrganizerCommand(f.client,owner,input,randomUUID()),/session/);
  assert.equal(f.keys.length,0);
});
test('expected actor binds the RPC even if auth changes after the preliminary identity check', async () => {
  const f=fixture();f.state.switchOnRpc=true;
  await assert.rejects(executeOrganizerCommand(f.client,owner,input,randomUUID()),/account changed/);
  assert.equal(f.receipts.size,0);assert.equal(f.rows.size,0);
});
test('RPC identity mismatch retains a previously uncertain A request for replay after returning to A', async () => {
  const f=fixture();const manager=f.manager();f.state.loseResponse=true;
  await assert.rejects(manager.send(input));f.state.switchOnRpc=true;
  await assert.rejects(manager.send(),/account changed/);assert.equal(f.saved.size,1);
  f.state.switchOnRpc=false;f.state.authOwner=owner;await manager.send();
  assert.equal(f.receipts.size,1);assert.equal(f.saved.size,0);
});

test('returning between timing screens reloads pending recovery and clears requests confirmed elsewhere', async () => {
  const f = fixture(), entry = f.manager(), quick = f.manager();
  await entry.load();
  f.state.loseResponse = true;
  await assert.rejects(quick.send(input));
  const pending = await entry.load();
  assert.equal(pending.requestId, quick.pending.requestId);
  await quick.send();
  assert.equal(await entry.load(), null);
  assert.equal(entry.pending, null);
  assert.equal(f.rows.size, 1);
});

test('refocusing an in-flight organizer write preserves its request and one server record', async () => {
  const f = fixture(), original = f.client.rpc; let release;
  const gate = new Promise(resolve => { release = resolve; });
  f.client.rpc = async (...args) => { await gate; return original(...args); };
  const manager = f.manager(), result = manager.send(input);
  assert.equal(manager.busy, true);
  assert.ok(await manager.load());
  assert.ok(manager.pending);
  release(); await result;
  assert.equal(manager.busy, false); assert.equal(manager.pending, null);
  assert.equal(f.rows.size, 1); assert.equal(f.keys.length, 1);
});
