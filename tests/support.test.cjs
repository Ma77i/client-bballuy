const { test } = require('node:test');
const assert = require('node:assert/strict');
const { supportDraft, openSupportDraft } = require('../lib/support.ts');

test('support draft contains only user-filled prompts and a configured test contact', async () => {
  const url = supportDraft('support@example.invalid');
  assert.ok(url.startsWith('mailto:'));
  const params = new URLSearchParams(url.split('?')[1]);
  assert.equal(params.get('subject'), 'BBallUY problem report');
  assert.match(params.get('body'), /Steps to reproduce/);
  assert.ok(!/token|user_id|session_id|email:|attachment/i.test(params.get('body')));
  let opened;
  await openSupportDraft('support@example.invalid', async value => { opened = value; });
  assert.equal(opened, url);
});
test('missing or injected support contacts never call the email handoff', async () => {
  let opened = 0;
  for (const email of [undefined, '', 'not-an-email', 'support@example.invalid?bcc=other@example.invalid', 'support@example.invalid\r\nBcc:other@example.invalid']) {
    assert.equal(supportDraft(email), null);
    await assert.rejects(openSupportDraft(email, async () => { opened++; }));
  }
  assert.equal(opened, 0);
});
test('email handoff failure propagates for the screen to offer retry', async () => {
  await assert.rejects(openSupportDraft('support@example.invalid', async () => { throw new Error('No email app'); }), /No email app/);
});
