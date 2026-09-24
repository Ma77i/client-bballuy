const {test}=require('node:test');
const assert=require('node:assert/strict');
const {setCourtMembership}=require('../lib/courts/membership.ts');
const owner='11111111-1111-4111-8111-111111111111';
const court='22222222-2222-4222-8222-222222222222';
function fixture() {
 let present=false, inserts=0, deletes=0;
 let writeError=null, readError=null, loseInsert=false, loseDelete=false, authOwner=owner;
 const client={auth:{getUser:async()=>({data:{user:{id:authOwner}},error:null})},from:()=>({
  insert:async()=>{inserts++;if(writeError)return {error:writeError};
   if(present)return {error:{code:'23505'}};present=true;
   if(loseInsert){loseInsert=false;throw Error('Response lost');} return {error:null};},
  delete:()=>{const q={eq(){return q;},then(resolve,reject){return Promise.resolve().then(()=>{
    deletes++;if(writeError)return {error:writeError};present=false;
    if(loseDelete){loseDelete=false;throw Error('Response lost');}return {error:null};}).then(resolve,reject);}};return q;},
  select:()=>{const q={eq(){return q;},maybeSingle:async()=>({data:present?{court_id:court}:null,error:readError})};return q;}
 })};
 return {client, state:()=>({present,inserts,deletes}),writeError:v=>{writeError=v;},readError:v=>{readError=v;},
 loseInsert:()=>{loseInsert=true;},loseDelete:()=>{loseDelete=true;},authOwner:v=>{authOwner=v;}};
}
test('lost join acknowledgement can be retried without creating another membership',async()=>{
 const f=fixture();f.loseInsert();await assert.rejects(setCourtMembership(f.client,owner,court,true));
 assert.equal(f.state().present,true);await setCourtMembership(f.client,owner,court,true);assert.equal(f.state().present,true);
});
test('lost leave acknowledgement can be retried and rejoin still works',async()=>{
 const f=fixture();await setCourtMembership(f.client,owner,court,true);f.loseDelete();
 await assert.rejects(setCourtMembership(f.client,owner,court,false));await setCourtMembership(f.client,owner,court,false);
 assert.equal(f.state().present,false);await setCourtMembership(f.client,owner,court,true);assert.equal(f.state().present,true);
});
test('read-back failure is uncertain, never reported as successful membership',async()=>{
 const f=fixture();f.readError({code:'NETWORK'});await assert.rejects(setCourtMembership(f.client,owner,court,true));
 f.readError(null);await setCourtMembership(f.client,owner,court,true);
});
test('permission and invalid-court failures are not swallowed as duplicates',async()=>{
 for(const code of ['42501','23503']){const f=fixture();f.writeError({code});await assert.rejects(setCourtMembership(f.client,owner,court,true));assert.equal(f.state().present,false);}
});
test('duplicate error alone is insufficient: actual membership must be visible',async()=>{
 const f=fixture();f.writeError({code:'23505'});await assert.rejects(setCourtMembership(f.client,owner,court,true),/could not be confirmed/);
});
test('changed identity and malformed IDs never submit writes',async()=>{
 const f=fixture();f.authOwner('different');await assert.rejects(setCourtMembership(f.client,owner,court,true),/session changed/);
 await assert.rejects(setCourtMembership(f.client,'',court,true),/Invalid/);
 assert.equal(f.state().inserts,0);assert.equal(f.state().deletes,0);
});
