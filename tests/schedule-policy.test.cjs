const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { localSchedule, localDateField, localTimeField, scheduleSelection, nextMinute, pickerValue, scheduleDateLabel } = require('../components/pickup/schedule-policy.ts');

test('local scheduling rejects normalized dates and preserves component fields', () => {
  assert.equal(localSchedule({date:'2026-02-30',time:'18:00'}),null);
  assert.equal(localSchedule({date:'2026-10-18',time:'25:00'}),null);
  const date=localSchedule({date:'2026-10-18',time:'18:45'});
  assert.equal(localDateField(date),'2026-10-18');assert.equal(localTimeField(date),'18:45');
  assert.match(scheduleDateLabel({date:'2026-10-18',time:'18:45'}),/18.*oct.*2026/);
});
test('picker prevents past selections without silently changing another field', () => {
  const now=new Date(2026,9,15,20,30,15), fields={date:'2026-10-16',time:'18:00'};
  const past=scheduleSelection(fields,'date',new Date(2026,9,14),now);
  assert.equal(past.accepted,false);assert.deepEqual(past.fields,fields);
  const today=scheduleSelection(fields,'date',new Date(2026,9,15),now);
  assert.equal(today.accepted,true);assert.equal(today.fields.time,'18:00');assert.match(today.error,/futura/);
  const hour=scheduleSelection(today.fields,'time',new Date(2026,9,15,19),now);
  assert.equal(hour.accepted,false);assert.deepEqual(hour.fields,today.fields);
  const future=scheduleSelection(today.fields,'time',new Date(2026,9,15,21),now);
  assert.equal(future.accepted,true);assert.equal(future.fields.time,'21:00');assert.equal(future.error,undefined);
});
test('native starting value is future-safe without mutating an elapsed draft', () => {
  const now=new Date(2026,11,31,23,59,55), fields={date:'2026-12-31',time:'18:00'};
  assert.equal(localDateField(nextMinute(now)),'2027-01-01');assert.equal(localTimeField(nextMinute(now)),'00:00');
  assert.ok(pickerValue(fields,now).getTime()>now.getTime());assert.equal(fields.time,'18:00');
});
test('local fields round-trip existing backend ISO in Uruguay, New York and Kolkata', () => {
  for(const [zone,iso] of [['America/Montevideo','2026-10-18T21:00:00.000Z'],['America/New_York','2026-10-18T22:00:00.000Z'],['Asia/Kolkata','2026-10-18T12:30:00.000Z']]){
    const script=`const assert=require('node:assert/strict');const p=require('./components/pickup/schedule-policy.ts');const o=require('./lib/pickup/organizer.ts');const fields={date:'2026-10-18',time:'18:00'};const native=p.localSchedule(fields);assert.equal(native.toISOString(),${JSON.stringify(iso)});const result=o.validateSessionDraft({...o.defaultSessionDraft('00000000-0000-4000-8000-000000000001'),...fields,timing:'future'},new Date(2026,9,15));assert.deepEqual(result.errors,{});assert.equal(result.data.scheduled_at,native.toISOString());const restored=o.restoredSessionDraft(result.data,o.defaultSessionDraft());assert.equal(restored.date,fields.date);assert.equal(restored.time,fields.time);`;
    execFileSync(process.execPath,['-e',script],{cwd:process.cwd(),env:{...process.env,TZ:zone}});
  }
});
test('DST gaps are rejected; repeated wall times follow the existing earlier occurrence contract', () => {
  execFileSync(process.execPath,['-e',`const assert=require('node:assert/strict');const p=require('./components/pickup/schedule-policy.ts');assert.equal(p.localSchedule({date:'2026-03-08',time:'02:30'}),null);assert.equal(p.localSchedule({date:'2026-11-01',time:'01:30'}).toISOString(),'2026-11-01T05:30:00.000Z');const repeated=p.scheduleSelection({date:'2026-11-01',time:'03:00'},'time',new Date('2026-11-01T06:30:00Z'),new Date('2026-10-31T12:00:00Z'));assert.equal(repeated.accepted,false);assert.match(repeated.error,/se repite/);`],{cwd:process.cwd(),env:{...process.env,TZ:'America/New_York'}});
});
