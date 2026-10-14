import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = name => readFileSync(path.join(root, name));
export const sha256 = data => createHash('sha256').update(data).digest('hex');
const spanish = 'ÁÉÍÓÚÜÑáéíóúüñ¿¡';

// Read SFNT metadata/cmap directly; no app or tooling dependency is needed.
export function inspectFont(data) {
  if (data.readUInt32BE(0) !== 0x00010000) throw new Error('Expected TrueType SFNT');
  const tables = {};
  for (let i = 0; i < data.readUInt16BE(4); i++) {
    const base = 12 + i * 16;
    const offset = data.readUInt32BE(base + 8), length = data.readUInt32BE(base + 12);
    if (offset + length > data.length) throw new Error('Invalid font table range');
    tables[data.toString('ascii', base, base + 4)] = offset;
  }
  const names = {};
  const name = tables.name;
  const strings = name + data.readUInt16BE(name + 4);
  for (let i = 0; i < data.readUInt16BE(name + 2); i++) {
    const base = name + 6 + i * 12;
    const platform = data.readUInt16BE(base), id = data.readUInt16BE(base + 6);
    const size = data.readUInt16BE(base + 8), offset = strings + data.readUInt16BE(base + 10);
    if ([0, 1, 2, 5, 13, 14].includes(id)) {
      const bytes = Buffer.from(data.subarray(offset, offset + size));
      names[id] = platform === 0 || platform === 3 ? bytes.swap16().toString('utf16le') : bytes.toString('latin1');
    }
  }
  const cmap = tables.cmap;
  const maps = [];
  for (let i = 0; i < data.readUInt16BE(cmap + 2); i++) {
    const base = cmap + 4 + i * 8, platform = data.readUInt16BE(base), encoding = data.readUInt16BE(base + 2);
    if (platform === 0 || (platform === 3 && [1, 10].includes(encoding))) maps.push(cmap + data.readUInt32BE(base + 4));
  }
  function glyph(code) {
    for (const map of maps) {
      const format = data.readUInt16BE(map);
      if (format === 4 && code <= 0xffff) {
        const count = data.readUInt16BE(map + 6) / 2;
        const end = map + 14, start = end + count * 2 + 2, delta = start + count * 2, range = delta + count * 2;
        for (let i = 0; i < count; i++) {
          if (code < data.readUInt16BE(start + i * 2) || code > data.readUInt16BE(end + i * 2)) continue;
          const shift = data.readInt16BE(delta + i * 2), distance = data.readUInt16BE(range + i * 2);
          if (!distance) return (code + shift) & 0xffff;
          const result = data.readUInt16BE(range + i * 2 + distance + 2 * (code - data.readUInt16BE(start + i * 2)));
          if (result) return (result + shift) & 0xffff;
        }
      } else if (format === 12) {
        for (let i = 0; i < data.readUInt32BE(map + 12); i++) {
          const group = map + 16 + i * 12, first = data.readUInt32BE(group), last = data.readUInt32BE(group + 4);
          if (code >= first && code <= last) return data.readUInt32BE(group + 8) + code - first;
        }
      }
    }
    return 0;
  }
  return { bytes: data.length, sha256: sha256(data), weight: data.readUInt16BE(tables['OS/2'] + 4),
    variable: tables.fvar !== undefined, names,
    missingSpanishGlyphs: [...spanish].filter(character => !glyph(character.codePointAt(0))) };
}

export function verifyAssets() {
  const manifest = JSON.parse(read('assets/fonts/manifest.json'));
  for (const font of manifest.fonts) {
    const actual = inspectFont(read(font.path));
    if (actual.sha256 !== font.sha256 || actual.weight !== font.weight || actual.variable || actual.missingSpanishGlyphs.length) {
      throw new Error(`Font metadata or Spanish coverage mismatch: ${font.path}`);
    }
    if (!read(font.license).toString().includes('SIL OPEN FONT LICENSE Version 1.1')) throw new Error('Missing OFL notice');
  }
  const art = JSON.parse(read('assets/illustrations/manifest.json'));
  for (const image of art.images) {
    const data = read(image.path);
    if (data.length > 65536 || sha256(data) !== image.sha256 || data.toString('ascii', 8, 12) !== 'WEBP') {
      throw new Error(`Invalid or oversized illustration: ${image.path}`);
    }
  }
  return { fonts: manifest.fonts.length, spanishGlyphs: spanish, illustrations: art.images.length,
    totalFontBytes: manifest.fonts.reduce((total, font) => total + font.bytes, 0),
    totalIllustrationBytes: art.images.reduce((total, image) => total + image.bytes, 0) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--write-font-manifest')) {
    const files = ['Lexend-Regular', 'Lexend-Medium', 'Lexend-SemiBold', 'Lexend-Bold', 'Teko-SemiBold'];
    writeFileSync(path.join(root, 'assets/fonts/manifest.json'), JSON.stringify({ verifiedOn: '2026-10-13',
      fonts: files.map(family => ({ family, path: `assets/fonts/${family}.ttf`, ...inspectFont(read(`assets/fonts/${family}.ttf`)),
        license: `assets/fonts/licenses/${family.startsWith('Teko') ? 'Teko' : 'Lexend'}-OFL.txt`,
        source: family.startsWith('Teko') ? 'https://fonts.gstatic.com/s/teko/v23/LYjYdG7kmE0gV69VVPPdFl06VN_JHIS11zY.ttf'
          : 'Existing project binary, retained; original download source not recorded',
      })) }, null, 2) + '\n');
  } else console.log(JSON.stringify(verifyAssets(), null, 2));
}
