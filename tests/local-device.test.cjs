const test = require('node:test');
const assert = require('node:assert/strict');
const { selectLanAddress } = require('../scripts/local-device.mjs');
const address = value => ({ address: value, internal: false, family: 'IPv4' });

test('device preview prefers the Wi-Fi address over Docker adapters', () => {
  assert.equal(selectLanAddress({ 'Wi-Fi': [address('192.168.1.42')], Docker: [address('172.18.0.1')] }), '192.168.1.42');
});
test('device preview rejects public, loopback, URLs and unassigned addresses', () => {
  const interfaces = { Ethernet: [address('192.168.1.42')] };
  for (const input of ['8.8.8.8', '127.0.0.1', 'https://example.com', '192.168.1.43']) {
    assert.throws(() => selectLanAddress(interfaces, input), /private IPv4 assigned/);
  }
});
test('ambiguous adapters require an explicit locally assigned private address', () => {
  const interfaces = { Ethernet: [address('10.0.0.2')], Docker: [address('172.18.0.1')] };
  assert.throws(() => selectLanAddress(interfaces), /Choose/);
  assert.equal(selectLanAddress(interfaces, '10.0.0.2'), '10.0.0.2');
  assert.throws(() => selectLanAddress({ lo: [{ ...address('127.0.0.1'), internal: true }] }), /none/);
});
