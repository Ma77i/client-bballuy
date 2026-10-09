const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createAccountCache, disposeAccountCache, accountQueryKey } = require('../lib/auth/account-cache.ts');
const { createNotificationStore, notificationKey } = require('../lib/auth/notifications.ts');
const tick = () => new Promise(resolve => setImmediate(resolve));
const row = { id: 'fixture', type: 'team_update', title: 'Only A', message: 'Fixture', timestamp: '2026-09-23T12:00:00Z', isRead: false };
const key = owner => notificationKey('local', owner);

test('fresh identity caches never expose A profile or courts to B, including late responses', async () => {
  const a = createAccountCache(); let resolve;
  a.setQueryData(accountQueryKey('a','me'), { name: 'A' });
  const pending = a.fetchQuery({ queryKey: accountQueryKey('a','my-courts'), queryFn: () => new Promise(r => { resolve = r; }), retry: false }).catch(() => undefined);
  disposeAccountCache(a);
  const b = createAccountCache();
  assert.equal(b.getQueryData(accountQueryKey('b','me')), undefined);
  resolve(['A court']); await pending; await tick();
  assert.equal(b.getQueryData(accountQueryKey('b','my-courts')), undefined);
  assert.equal(a.getQueryCache().getAll().length, 0);
  b.setQueryData(accountQueryKey('b','my-courts'), ['B court']);
  disposeAccountCache(b);
  const again = createAccountCache();
  assert.equal(again.getQueryData(accountQueryKey('a','my-courts')), undefined);
  disposeAccountCache(again);
});
test('notifications hydrate without erasing storage and isolate A -> B -> A', async () => {
  const values = new Map([[key('a'), JSON.stringify([row])], ['notifications', JSON.stringify([row])]]);
  const writes = [];
  const storage = { getItem: async k => values.get(k) ?? null, setItem: async (k,v) => { writes.push(k); values.set(k,v); } };
  const a = createNotificationStore(storage,key('a')); const stopA = a.start();
  assert.equal(a.snapshot().length,0); await tick();
  assert.equal(a.snapshot()[0].title,'Only A'); assert.equal(writes.length,0);
  a.markAllAsRead(); await a.flushed(); stopA();
  a.addNotification({ type:'team_update', title:'Late', message:'Must be ignored' });
  const b = createNotificationStore(storage,key('b')); const stopB = b.start(); await tick();
  assert.equal(b.snapshot().length,0); assert.equal(writes.length,1);
  b.addNotification({type:'team_update',title:'Only B',message:'Fixture'}); await b.flushed(); stopB();
  const again = createNotificationStore(storage,key('a')); const stopAgain=again.start(); await tick();
  assert.equal(again.snapshot().length,1); assert.equal(again.snapshot()[0].isRead,true);
  stopAgain();
});
test('late hydration and signed-out callbacks cannot publish or write notifications', async () => {
  let resolve; let writes=0;
  const storage={getItem:()=>new Promise(r=>{resolve=r;}),setItem:async()=>{writes++;}};
  const a=createNotificationStore(storage,key('a')); const stop=a.start(); await tick(); stop();
  resolve(JSON.stringify([row])); await tick(); assert.equal(a.snapshot().length,0);
  const guest=createNotificationStore(storage,null); const stopGuest=guest.start();
  guest.addNotification({type:'team_update',title:'Guest',message:'Ignore'}); await tick();
  assert.equal(writes,0); stopGuest();
});
test('notification writes stay ordered and cannot overwrite pre-hydration data', async () => {
  let finishRead; let finishWrite; const writes=[];
  const store=createNotificationStore({getItem:()=>new Promise(r=>{finishRead=r;}),setItem:async(k,v)=>{
    writes.push(JSON.parse(v)); if(writes.length===1) await new Promise(r=>{finishWrite=r;});
  }},key('a'));
  const stop=store.start(); await tick(); store.clearNotifications(); assert.equal(writes.length,0);
  finishRead(JSON.stringify([row])); await tick(); store.markAllAsRead(); store.clearNotifications();
  await tick(); assert.equal(writes.length,1); finishWrite(); await store.flushed();
  assert.equal(writes[0][0].isRead,true); assert.deepEqual(writes[1],[]); stop();
});

test('returning to A waits for the old A instance pending write before hydration', async () => {
  let finish; let stored=JSON.stringify([row]);
  const storage={getItem:async()=>stored,setItem:async(k,v)=>{await new Promise(r=>{finish=r;});stored=v;}};
  const first=createNotificationStore(storage,key('a'));const stop=first.start();await tick();
  first.markAllAsRead();await tick();stop();
  const again=createNotificationStore(storage,key('a'));const stopAgain=again.start();await tick();
  assert.equal(again.snapshot().length,0);finish();await first.flushed();await tick();
  assert.equal(again.snapshot()[0].isRead,true);stopAgain();
});
