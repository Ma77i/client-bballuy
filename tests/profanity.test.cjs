const assert = require('node:assert/strict');
const { test } = require('node:test');
const { containsProfanity, cleanProfanity, validateContent } = require('../lib/utils/profanity.ts');

test('ordinary basketball text remains valid and unchanged', () => {
  const text = 'Meet at the basketball court';
  assert.equal(containsProfanity(text), false);
  assert.equal(cleanProfanity(text), text);
  assert.deepEqual(validateContent(text), {
    valid: true,
    cleaned: text,
    hasProfanity: false,
  });
});

test('profanity detection is case-insensitive and respects word boundaries', () => {
  assert.equal(containsProfanity('SHIT!'), true);
  assert.equal(containsProfanity('classic basketball'), false);
});

test('cleaning masks profanity while preserving surrounding words', () => {
  assert.equal(cleanProfanity('that shit happens'), 'that **** happens');
});

test('validation rejects profanity and returns the masked text', () => {
  assert.deepEqual(validateContent('SHIT happens'), {
    valid: false,
    cleaned: '**** happens',
    hasProfanity: true,
  });
});
