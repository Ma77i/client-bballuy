import { isIP } from 'node:net';

function privateIPv4(address) {
  if (isIP(address) !== 4) return false;
  const [first, second] = address.split('.').map(Number);
  return first === 10 || (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168);
}

export function selectLanAddress(interfaces, requested) {
  const candidates = Object.entries(interfaces).flatMap(([name, addresses]) =>
    (addresses ?? []).filter(item => !item.internal && privateIPv4(item.address))
      .map(item => ({ name, address: item.address })));
  if (requested) {
    if (!candidates.some(item => item.address === requested)) {
      throw new Error('Device address must be a private IPv4 assigned to this computer.');
    }
    return requested;
  }
  const wireless = candidates.filter(item => /wi-?fi|wireless|wlan/i.test(item.name));
  const addresses = [...new Set((wireless.length ? wireless : candidates).map(item => item.address))];
  if (addresses.length !== 1) {
    throw new Error(`Choose the computer's Wi-Fi address with --address=IP. Available private addresses: ${candidates.map(item => item.address).join(', ') || 'none'}`);
  }
  return addresses[0];
}
