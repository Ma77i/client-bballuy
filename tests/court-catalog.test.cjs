const {test}=require('node:test');const assert=require('node:assert/strict');
const {validateCatalog,filterCourts,catalogRegion,loadCatalog}=require('../lib/courts/catalog.ts');
const {locateUser}=require('../lib/courts/location.ts');
const row={id:'a',name:'Cancha Unión',latitude:-34.9,longitude:-56.1,half_court:null,lighting:null,surface:null,notes:null,created_at:null};
test('catalog preserves verified attributes and rejects invalid or duplicate marker coordinates',()=>{
 assert.deepEqual(validateCatalog([row]),[row]);
 for(const bad of [{...row,latitude:null},{...row,longitude:181},{...row,latitude:NaN},{...row,id:null}])assert.throws(()=>validateCatalog([bad]));
 assert.throws(()=>validateCatalog([row,row]));assert.deepEqual(validateCatalog([]),[]);
 assert.equal(validateCatalog([{...row,latitude:0,longitude:0}])[0].latitude,0);
});
test('one filter drives marker and list identities including accent-insensitive search and empty result',()=>{
 const rows=validateCatalog([row,{...row,id:'b',name:'Other'}]);
 assert.deepEqual(filterCourts(rows,'  UNION ').map(c=>c.id),['a']);
 assert.deepEqual(filterCourts(rows,'missing'),[]);assert.equal(filterCourts(rows,'').length,2);
});
test('initial map region includes all local catalog points with nonzero single-point bounds',()=>{
 const points=[row,{latitude:-34.8,longitude:-56.3}];const r=catalogRegion(points);
 for(const p of points){assert.ok(Math.abs(p.latitude-r.latitude)<r.latitudeDelta/2);assert.ok(Math.abs(p.longitude-r.longitude)<r.longitudeDelta/2);}
 assert.ok(catalogRegion([row]).latitudeDelta>0);assert.ok(Number.isFinite(catalogRegion([]).latitude));
});
test('denied location never requests coordinates and leaves manual browsing available',async()=>{
 let calls=0;const r=await locateUser(async()=>({granted:false}),async()=>{calls++;throw Error();});
 assert.equal(calls,0);assert.equal(r.point,null);assert.match(r.message,/still browse/);
});
test('unavailable location is recoverable and granted location only returns coordinates',async()=>{
 const fail=await locateUser(async()=>({granted:true}),async()=>{throw Error('private details');});
 assert.equal(fail.point,null);assert.doesNotMatch(fail.message,/private details/);
 const ok=await locateUser(async()=>({granted:true}),async()=>({coords:row}));
 assert.deepEqual(ok.point,{latitude:-34.9,longitude:-56.1});
});
test('catalog errors propagate for retry instead of appearing as an empty catalog',async()=>{
 const query={select(){return this},order(){return Promise.resolve({data:null,error:new Error('fixture')});}};
 await assert.rejects(loadCatalog({from:()=>query}),/fixture/);
});
