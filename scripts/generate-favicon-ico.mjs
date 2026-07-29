/**
 * Builds public/favicon.ico from public/favicon.svg.
 *
 * Written by hand rather than pulling in a dependency: an ICO is a 6-byte
 * header, a 16-byte directory entry per size, then the payloads. PNG-in-ICO is
 * supported by every browser that matters, so each entry is just a PNG.
 */
import fs from 'node:fs';
import sharp from 'sharp';

const SIZES = [16, 32, 48];
const svg = fs.readFileSync('public/favicon.svg');

const pngs = await Promise.all(
  SIZES.map((s) => sharp(svg, { density: 384 }).resize(s, s).png({ compressionLevel: 9 }).toBuffer())
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = icon
header.writeUInt16LE(SIZES.length, 4);

const entries = [];
let offset = 6 + SIZES.length * 16;
SIZES.forEach((size, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size === 256 ? 0 : size, 0);
  e.writeUInt8(size === 256 ? 0 : size, 1);
  e.writeUInt8(0, 2); // palette size
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  entries.push(e);
});

fs.writeFileSync('public/favicon.ico', Buffer.concat([header, ...entries, ...pngs]));
console.log(`favicon.ico written: ${SIZES.join(', ')}px, ${fs.statSync('public/favicon.ico').size} bytes`);
