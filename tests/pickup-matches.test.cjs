const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { matchPlayers, validateMatchDraft, validateFinalScore, createMatchManager, loadMatch, searchMatchPlayers } = require('../lib/pickup/matches.ts');
const owner = '11111111-1111-4111-8111-111111111111', other = '22222222-2222-4222-8222-222222222222';
const id = '33333333-3333-4333-8333-333333333333', court = '44444444-4444-4444-8444-444444444444';
const draft = { courtId: court, format: '1v1', sourceId: '', players: [
  { side:'A',kind:'account',userId:owner,label:'Fixture A' }, {side:'B',kind:'guest',userId:'',label:'Guest B'} ] };
const input = validateMatchDraft(draft).input;
function fixture() {
  const saved = new Map(), receipts = new Map(), calls = [], history = [];
  const game = {id,organizer_id:owner,court_id:court,format:'1v1',source_session_id:null,state:'started',score_a:null,score_b:null,revision:0,created_at:new Date().toISOString(),closed_at:null};
  const players = [{id:randomUUID(),match_id:id,side:'A',user_id:owner,guest_label:null,display_name:'Fixture A'}, {id:randomUUID(),match_id:id,side:'B',user_id:null,guest_label:'Guest B',display_name:'Guest B'}];
  const state = {actor:owner,lose:false,readError:false,saveError:false,removeError:false,switchOnRpc:false,gate:null};
  const client = { auth:{getUser:async()=>({data:{user:{id:state.actor}},error:null})},
    rpc:async(name,args)=>{
      calls.push(args); if(state.gate) await state.gate;
      if(state.switchOnRpc) state.actor=other;
      if(args.p_expected_actor!==state.actor)return {data:null,error:{code:'42501',message:'Caller identity changed'}};
      if(!receipts.has(args.p_request_id)) {
        if(args.p_action==='score') {
          if(args.p_data.expected_revision!==game.revision)return {data:null,error:{code:'PT409'}};
          history.push({match_id:id,revision:game.revision+1,previous_a:game.score_a,previous_b:game.score_b,score_a:args.p_data.score_a,score_b:args.p_data.score_b,changed_at:new Date().toISOString()});
          game.score_a=args.p_data.score_a;game.score_b=args.p_data.score_b;game.revision++;game.state='completed';game.closed_at??=new Date().toISOString();
        }
        receipts.set(args.p_request_id,{...game});
      }
      if(state.lose){state.lose=false;throw new Error('Lost synthetic reply');}
      return {data:receipts.get(args.p_request_id),error:null};
    },
    from(relation){
      let target,offset=0,end=Infinity;const q={select(){return q;},eq(key,value){if(key==='id'||key==='match_id')target=value;return q;},order(){return q;},abortSignal(){return q;},range(a,b){offset=a;end=b;return q;},
        maybeSingle:async()=>({data:target===id?{...game}:null,error:state.readError?{}:null}),
        then(resolve,reject){const rows=(relation==='pickup_match_roster'?players:history).slice(offset,end+1).map(row=>({...row}));return Promise.resolve({data:rows,error:state.readError?{}:null}).then(resolve,reject);} };return q;
    } };
  const storage={getItem:async key=>saved.get(key)??null,setItem:async(key,value)=>{if(state.saveError)throw new Error('Storage unavailable');saved.set(key,value);},removeItem:async key=>{if(state.removeError)throw new Error('Cleanup unavailable');saved.delete(key);}};
  const manager=(scope='create',extra={})=>createMatchManager({client,storage,owner,backend:'local',scope,makeId:randomUUID,...extra});
  return {client,state,manager,saved,game,players,history,calls,receipts};
}
test('match drafts require exact supported side sizes and distinct account identities',()=>{
  for(const format of ['1v1','2v2','5v5']) {
    const players=matchPlayers(format).map((p,i)=>({...p,label:'Guest '+i}));
    assert.deepEqual(validateMatchDraft({...draft,format,players}).errors,{});
    assert.ok(validateMatchDraft({...draft,format,players:players.slice(1)}).errors.players);
  }
  assert.ok(validateMatchDraft({...draft,players:[draft.players[0],{...draft.players[0],side:'B'}]}).errors.player1);
  assert.ok(validateMatchDraft({...draft,players:[draft.players[0],{...draft.players[1],label:''}]}).errors.player1);
  assert.ok(validateMatchDraft({...draft,sourceId:'invalid'}).errors.sourceId);
});
test('final scores validate revision and whole nonnegative SQL integers including ties',()=>{
  assert.deepEqual(validateFinalScore(id,0,'0','0').errors,{});
  for(const value of ['','-1','1.5','2147483648','NaN'])assert.ok(validateFinalScore(id,0,value,'2').errors.scoreA);
  assert.ok(validateFinalScore(id,-1,'1','2').errors.match);
});
test('lost creation reply reloads one request and confirms one roster without replacing its input',async()=>{
  const f=fixture();f.state.lose=true;const first=f.manager();await assert.rejects(first.send(input));
  const fresh=f.manager(),pending=await fresh.load();const result=await fresh.send({...input,data:{...input.data,format:'5v5'}});
  assert.equal(result.players.length,2);assert.equal(f.receipts.size,1);
  assert.equal(f.calls[1].p_request_id,pending.requestId);assert.equal(f.calls[1].p_data.format,'1v1');assert.equal(fresh.pending,null);
});
test('score replay reads the latest revision rather than reverting a newer correction',async()=>{
  const f=fixture(),manager=f.manager(id);f.state.lose=true;
  await assert.rejects(manager.send(validateFinalScore(id,0,'11','9').input));
  await f.client.rpc('pickup_command',{p_request_id:randomUUID(),p_expected_actor:owner,p_action:'score',p_data:{expected_revision:1,score_a:12,score_b:9}});
  const result=await manager.send();assert.equal(result.game.score_a,12);assert.equal(result.history.length,2);assert.equal(result.history[1].previous_a,11);
});
test('revision conflicts clear only rejected requests and cannot overwrite current scores',async()=>{
  const f=fixture();await f.manager(id).send(validateFinalScore(id,0,'11','9').input);
  const conflict=f.manager(id);await assert.rejects(conflict.send(validateFinalScore(id,0,'99','99').input),/changed/);
  assert.equal(conflict.pending,null);assert.equal(f.game.score_a,11);assert.equal(f.history.length,1);
});
test('readback and device cleanup failures preserve requests until match/history are confirmed',async()=>{
  const f=fixture(),manager=f.manager();f.state.readError=true;
  await assert.rejects(manager.send(input),/may be saved/);assert.ok(manager.pending);
  f.state.readError=false;f.state.removeError=true;await assert.rejects(manager.send());assert.ok(manager.pending);
  f.state.removeError=false;await manager.send();assert.equal(manager.pending,null);assert.equal(f.receipts.size,1);
});
test('double presses, focus during transport and failed persistence never duplicate writes',async()=>{
  const f=fixture(),manager=f.manager();f.state.saveError=true;await assert.rejects(manager.send(input));assert.equal(f.calls.length,0);
  f.state.saveError=false;let release;f.state.gate=new Promise(resolve=>{release=resolve;});const a=manager.send(),b=manager.send(input);
  assert.equal(a,b);assert.ok(await manager.load());release();await a;assert.equal(f.calls.length,1);
});
test('saved match input and expected actor do not cross account/backend/match scopes',async()=>{
  const f=fixture(),manager=f.manager();f.state.lose=true;await assert.rejects(manager.send(input));
  assert.equal(await f.manager('create',{owner:other}).load(),null);assert.equal(await f.manager('create',{backend:'other'}).load(),null);
  assert.equal(await f.manager(id).load(),null);f.state.switchOnRpc=true;await assert.rejects(manager.send());assert.ok(manager.pending);
});
test('incomplete sides or discontinuous history never become confirmed match details',async()=>{
  const f=fixture();f.players.pop();await assert.rejects(loadMatch(f.client,owner,id),/incomplete/);
  const g=fixture();await g.manager(id).send(validateFinalScore(id,0,'11','9').input);g.history[0].score_a=99;
  await assert.rejects(loadMatch(g.client,owner,id),/changed during/);
});
test('short player search never calls the backend and anonymous match reads fail before querying',async()=>{
  const f=fixture();assert.deepEqual(await searchMatchPlayers(f.client,owner,'a'),[]);assert.equal(f.calls.length,0);
  await assert.rejects(loadMatch(f.client,'',id),/Sign in/);
});
test('result history pages beyond API limits without losing earlier corrections',async()=>{
  const f=fixture();
  for(let revision=1;revision<=1001;revision++)f.history.push({match_id:id,revision,previous_a:revision===1?null:revision-1,previous_b:revision===1?null:0,score_a:revision,score_b:0,changed_at:new Date().toISOString()});
  Object.assign(f.game,{state:'completed',score_a:1001,score_b:0,revision:1001,closed_at:new Date().toISOString()});
  const detail=await loadMatch(f.client,owner,id);assert.equal(detail.history.length,1001);assert.equal(detail.history[0].revision,1);assert.equal(detail.history.at(-1).revision,1001);
});
