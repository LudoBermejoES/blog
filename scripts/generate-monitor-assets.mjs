#!/usr/bin/env node
/**
 * Generates the animated WebP loops shown in the blog post "monitor" widget
 * (the .rq-tv panel in packages/theme/src/styles/blog-post.css).
 *
 * These replace two clips of commercial film footage that shipped with the
 * upstream theme. Everything here is drawn from scratch by this script, so the
 * output has no third-party provenance and is released CC0-1.0 — see
 * packages/theme/src/assets/theme/monitor/README.md.
 *
 * Deterministic: the PRNG is seeded per scene, so re-running reproduces the
 * assets byte-for-byte on the same sharp/libwebp build.
 *
 * Usage: npm run assets:monitor
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/*
  4:3 to match the widget's `aspect-ratio: 4 / 3`. The <img> inside it is
  width/height 100% with no object-fit, so a mismatched source is stretched —
  which is what happened to the 2.45:1 footage this replaces.
*/
/*
  Mutable so the OG still can reuse the same drawing helpers at its own size.
  Scenes render strictly one at a time, so there is no interleaving hazard.
*/
let W = 480;
let H = 360;
function setSize(w, h) {
  W = w;
  H = h;
}
const FRAMES = 36;
/* 33ms matches FRAME_MS in packages/theme/src/scripts/blogpost/red-queen-tv.js. */
const DELAY_MS = 33;

const W_ANIM = 480;
const H_ANIM = 360;

const OUT_DIR = 'packages/theme/src/assets/theme/monitor';
const PLACEHOLDER_DIR = 'packages/theme/src/assets/theme/placeholders';

/* mulberry32 — small, fast, and seedable so output stays reproducible. */
function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Float RGB accumulation buffer; values are additive and tone-mapped at the end. */
function createCanvas() {
  return new Float32Array(W * H * 3);
}

function addPixel(buf, x, y, r, g, b) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  buf[i] += r;
  buf[i + 1] += g;
  buf[i + 2] += b;
}

/** Separable box blur, used to fake a phosphor glow around bright marks. */
function blur(src, radius) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const span = radius * 2 + 1;
  for (let y = 0; y < H; y++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let x = -radius; x <= radius; x++) {
        sum += src[(y * W + Math.min(W - 1, Math.max(0, x))) * 3 + c];
      }
      for (let x = 0; x < W; x++) {
        tmp[(y * W + x) * 3 + c] = sum / span;
        const outX = Math.min(W - 1, Math.max(0, x - radius));
        const inX = Math.min(W - 1, Math.max(0, x + radius + 1));
        sum += src[(y * W + inX) * 3 + c] - src[(y * W + outX) * 3 + c];
      }
    }
  }
  for (let x = 0; x < W; x++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let y = -radius; y <= radius; y++) {
        sum += tmp[(Math.min(H - 1, Math.max(0, y)) * W + x) * 3 + c];
      }
      for (let y = 0; y < H; y++) {
        out[(y * W + x) * 3 + c] = sum / span;
        const outY = Math.min(H - 1, Math.max(0, y - radius));
        const inY = Math.min(H - 1, Math.max(0, y + radius + 1));
        sum += tmp[(inY * W + x) * 3 + c] - tmp[(outY * W + x) * 3 + c];
      }
    }
  }
  return out;
}

/**
 * Tone-map the float buffer to 8-bit and apply the CRT treatment:
 * scanlines, edge vignette, and a faint per-pixel noise floor.
 * The panel already lays a cyan scanline gradient over the top in CSS, so this
 * stays subtle to avoid a moire pattern against it.
 */
function finish(buf, glowBuf, rng, { exposure = 1.12, vignette = 0.55, scanline = 0.72 } = {}) {
  const out = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) {
    /* Darken every third row — the classic CRT line structure. */
    const scan = y % 3 === 0 ? scanline : 1;
    const dy = (y / H) * 2 - 1;
    for (let x = 0; x < W; x++) {
      const dx = (x / W) * 2 - 1;
      /* Soft radial falloff, stronger in the corners. */
      const vig = Math.max(0, 1 - vignette * (dx * dx + dy * dy) ** 1.1);
      const i = (y * W + x) * 3;
      const noise = (rng() - 0.5) * 7;
      for (let c = 0; c < 3; c++) {
        const v = (buf[i + c] + glowBuf[i + c] * 0.85) * scan * vig + noise;
        /* Filmic-ish knee so the bright trace cores roll off instead of clipping flat. */
        const t = v / 255;
        const mapped = t <= 0 ? 0 : (t / (1 + t * 0.35)) * 255 * exposure;
        out[i + c] = Math.max(0, Math.min(255, mapped));
      }
    }
  }
  return out;
}

/* ---------------------------------------------------------------------------
   Scene 1 — signal sweep: an oscilloscope trace on a grid, with a scanning
   column and an occasional sync tear. Reads as a live telemetry feed.
   --------------------------------------------------------------------------- */
function renderSignalSweep(frame, rng) {
  const buf = createCanvas();
  const marks = createCanvas();
  const t = frame / FRAMES;
  /* Phase advances exactly 2*PI over the loop and all harmonics are integers,
     so the last frame joins the first with no seam. */
  const phase = t * Math.PI * 2;

  /* Base wash: a cold vertical gradient. */
  for (let y = 0; y < H; y++) {
    const g = 1 - y / H;
    for (let x = 0; x < W; x++) {
      addPixel(buf, x, y, 3 + g * 4, 9 + g * 10, 14 + g * 16);
    }
  }

  /* Reference grid. */
  const CELL = 40;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (x % CELL === 0 || y % CELL === 0) addPixel(buf, x, y, 6, 22, 30);
    }
  }
  /* Brighter centre axes. */
  for (let x = 0; x < W; x++) addPixel(buf, x, H >> 1, 8, 34, 44);
  for (let y = 0; y < H; y++) addPixel(buf, W >> 1, y, 8, 34, 44);

  /*
    Three traces at different amplitudes/harmonics. Drawn into `marks` so only
    the bright marks feed the glow pass, not the background wash.
  */
  const traces = [
    { amp: 62, harm: [1, 3, 5], speed: 1, col: [110, 235, 255], thick: 1.5 },
    { amp: 34, harm: [2, 5], speed: -2, col: [40, 150, 190], thick: 1.0 },
    { amp: 18, harm: [4, 7], speed: 3, col: [30, 110, 150], thick: 0.9 },
  ];
  for (const tr of traces) {
    for (let x = 0; x < W; x++) {
      const u = x / W;
      let v = 0;
      for (let hI = 0; hI < tr.harm.length; hI++) {
        const k = tr.harm[hI];
        v += Math.sin(u * Math.PI * 2 * k + phase * tr.speed * (hI + 1)) / (hI + 1);
      }
      /* Envelope so the trace tapers toward the screen edges. */
      const env = Math.sin(u * Math.PI) ** 0.5;
      const y = H / 2 + v * tr.amp * env;
      /* Splat with vertical falloff for a soft ~1-2px line. */
      for (let d = -3; d <= 3; d++) {
        const w = Math.exp(-((d / tr.thick) ** 2));
        if (w < 0.02) continue;
        addPixel(marks, x, Math.round(y) + d, tr.col[0] * w, tr.col[1] * w, tr.col[2] * w);
      }
    }
  }

  /* Scanning column, wraps exactly once per loop. */
  const scanX = Math.floor(t * W);
  for (let d = -14; d <= 14; d++) {
    const x = (scanX + d + W) % W;
    const w = Math.exp(-((d / 6) ** 2)) * (d <= 0 ? 1 : 0.35);
    for (let y = 0; y < H; y++) {
      addPixel(marks, x, y, 20 * w, 70 * w, 95 * w);
    }
  }

  /* Sync tear: a band of horizontal displacement, twice per loop. */
  const tearPhase = (t * 2) % 1;
  if (tearPhase < 0.18) {
    const bandY = Math.floor(((frame * 97) % H) / 1);
    const bandH = 10 + Math.floor(rng() * 14);
    const shift = Math.floor((rng() - 0.5) * 40);
    for (let y = bandY; y < Math.min(H, bandY + bandH); y++) {
      for (let x = 0; x < W; x++) {
        const src = ((x + shift) % W + W) % W;
        const si = (y * W + src) * 3;
        const di = (y * W + x) * 3;
        for (let c = 0; c < 3; c++) marks[di + c] = Math.max(marks[di + c], marks[si + c] * 0.9);
      }
    }
  }

  /* Corner readout blocks — abstract "data", no glyphs so no font dependency. */
  for (let r = 0; r < 4; r++) {
    const on = ((frame + r * 5) >> 1) % 3 !== 0;
    if (!on) continue;
    const bw = 26 + ((r * 13) % 22);
    for (let y = 14 + r * 9; y < 14 + r * 9 + 4; y++) {
      for (let x = W - 18 - bw; x < W - 18; x++) addPixel(marks, x, y, 30, 120, 155);
    }
  }

  return finish(buf, blur(marks, 3), rng);
}

/* ---------------------------------------------------------------------------
   Scene 2 — data cascade: columns of glyph-like cells falling with bright
   heads and fading tails. A code-rain motif, drawn procedurally.
   --------------------------------------------------------------------------- */
function renderDataCascade(frame, rng, columns) {
  const buf = createCanvas();
  const marks = createCanvas();
  const t = frame / FRAMES;

  for (let y = 0; y < H; y++) {
    const g = 1 - y / H;
    for (let x = 0; x < W; x++) {
      addPixel(buf, x, y, 2 + g * 3, 8 + g * 8, 12 + g * 12);
    }
  }

  const CELL_W = 16;
  const CELL_H = 18;

  for (const col of columns) {
    /*
      Advance by `col.cells` whole cells over the loop, and index the glyph
      pattern modulo `col.cells`. Shifting by a full period maps every cell
      back onto itself, so the loop closes exactly.
    */
    const offset = t * col.cells * CELL_H;
    const x0 = col.index * CELL_W;

    for (let cell = -1; cell < Math.ceil(H / CELL_H) + 1; cell++) {
      const yTop = Math.round(cell * CELL_H + (offset % (col.cells * CELL_H)));
      const wrapped = ((yTop % (H + CELL_H)) + H + CELL_H) % (H + CELL_H);
      const patternIndex = ((cell % col.cells) + col.cells) % col.cells;
      const bits = col.glyphs[patternIndex];

      /* Distance from the column head drives brightness: head hot, tail dim. */
      const headDist = ((wrapped / H) + col.offset) % 1;
      const lum = Math.max(0, 1 - headDist * col.fade);
      if (lum <= 0.02) continue;
      const isHead = headDist < 0.1;

      /* 3x5 bit grid per cell, scaled up — suggests a character without a font. */
      for (let by = 0; by < 5; by++) {
        for (let bx = 0; bx < 3; bx++) {
          if (!(bits & (1 << (by * 3 + bx)))) continue;
          const px = x0 + 2 + bx * 4;
          const py = wrapped + 2 + by * 3;
          /* The panel adds its own vignette and scanline pass in CSS, so the
             tails are pitched brighter than they need to look on their own. */
          const r = isHead ? 205 : 26 * lum;
          const g = isHead ? 255 : 250 * lum;
          const b = isHead ? 240 : 215 * lum;
          for (let dy = 0; dy < 3; dy++) {
            for (let dx = 0; dx < 3; dx++) addPixel(marks, px + dx, py + dy, r, g, b);
          }
        }
      }
    }
  }

  return finish(buf, blur(marks, 2), rng);
}

/* ---------------------------------------------------------------------------
   Open Graph fallback still. Replaces an Astro-branded template image that was
   serving as this site's default social preview.
   --------------------------------------------------------------------------- */
function renderOgFallback(rng) {
  const buf = createCanvas();
  const marks = createCanvas();
  const horizon = H * 0.58;

  /* Sky-to-ground wash. */
  for (let y = 0; y < H; y++) {
    const above = y < horizon;
    const k = above ? 1 - y / horizon : (y - horizon) / (H - horizon);
    for (let x = 0; x < W; x++) {
      if (above) addPixel(buf, x, y, 4 + k * 8, 12 + k * 20, 20 + k * 34);
      else addPixel(buf, x, y, 3, 8 + (1 - k) * 8, 14 + (1 - k) * 14);
    }
  }

  /* Perspective floor grid: lines converge on a vanishing point. */
  const vpX = W / 2;
  for (let i = -26; i <= 26; i++) {
    for (let y = Math.floor(horizon); y < H; y++) {
      const depth = (y - horizon) / (H - horizon);
      const x = Math.round(vpX + i * 30 * (0.06 + depth * 1.5));
      addPixel(marks, x, y, 8, 46 * depth + 8, 64 * depth + 10);
    }
  }
  for (let r = 1; r < 20; r++) {
    /* Geometric spacing so rows bunch toward the horizon. */
    const y = Math.round(horizon + (H - horizon) * (r / 20) ** 2.4);
    for (let x = 0; x < W; x++) addPixel(marks, x, y, 6, 34, 48);
  }

  /* Skyline silhouette with lit windows. */
  let x = 0;
  while (x < W) {
    const bw = 26 + Math.floor(rng() * 58);
    const bh = 40 + Math.floor(rng() * 190);
    const top = horizon - bh;
    for (let yy = Math.floor(top); yy < horizon; yy++) {
      for (let xx = x; xx < Math.min(W, x + bw); xx++) addPixel(buf, xx, yy, -2, -6, -8);
    }
    for (let wy = Math.floor(top) + 8; wy < horizon - 6; wy += 11) {
      for (let wx = x + 5; wx < Math.min(W, x + bw) - 5; wx += 9) {
        if (rng() < 0.42) {
          const lit = 0.5 + rng() * 0.5;
          for (let dy = 0; dy < 4; dy++) {
            for (let dx = 0; dx < 4; dx++) {
              addPixel(marks, wx + dx, wy + dy, 55 * lit, 215 * lit, 265 * lit);
            }
          }
        }
      }
    }
    x += bw + 3 + Math.floor(rng() * 8);
  }

  /* A single telemetry trace across the upper third, echoing the monitor loop. */
  for (let px = 0; px < W; px++) {
    const u = px / W;
    const v =
      Math.sin(u * Math.PI * 2 * 2) + Math.sin(u * Math.PI * 2 * 5) / 2.2 + Math.sin(u * Math.PI * 2 * 9) / 4;
    const y = H * 0.2 + v * 34 * Math.sin(u * Math.PI) ** 0.5;
    for (let d = -3; d <= 3; d++) {
      const w = Math.exp(-((d / 1.4) ** 2));
      addPixel(marks, px, Math.round(y) + d, 150 * w, 265 * w, 285 * w);
    }
  }

  return finish(buf, blur(marks, 4), rng, { exposure: 1.85, vignette: 0.34, scanline: 0.94 });
}

async function encode(frames, outPath) {
  const pngs = await Promise.all(
    frames.map((raw) => sharp(raw, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer())
  );
  await sharp(pngs, { join: { animated: true } })
    .webp({ quality: 74, effort: 6, loop: 0, delay: DELAY_MS })
    .toFile(outPath);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  /* --- Scene 1 --- */
  const rng1 = makeRng(0x5eed01);
  const sweep = [];
  for (let f = 0; f < FRAMES; f++) sweep.push(renderSignalSweep(f, rng1));
  const sweepPath = path.join(OUT_DIR, 'monitor-signal-sweep.webp');
  await encode(sweep, sweepPath);

  /* --- Scene 2 --- */
  const rng2 = makeRng(0x5eed02);
  const nCols = Math.ceil(W / 16);
  const columns = [];
  for (let i = 0; i < nCols; i++) {
    /* Loop period in whole cells; small set keeps the seam exact. */
    const cells = [6, 8, 9, 12][Math.floor(rng2() * 4)];
    const glyphs = [];
    for (let c = 0; c < cells; c++) {
      /* 15 random bits = a 3x5 pseudo-glyph. Bias toward ~half lit. */
      let bits = 0;
      for (let b = 0; b < 15; b++) if (rng2() < 0.45) bits |= 1 << b;
      glyphs.push(bits);
    }
    columns.push({ index: i, cells, glyphs, offset: rng2(), fade: 1.1 + rng2() * 1.6 });
  }
  const cascade = [];
  for (let f = 0; f < FRAMES; f++) cascade.push(renderDataCascade(f, rng2, columns));
  const cascadePath = path.join(OUT_DIR, 'monitor-data-cascade.webp');
  await encode(cascade, cascadePath);

  /* --- Open Graph fallback still (1200x630 is the standard OG ratio; the
         Astro-branded image this replaces was 960x480). --- */
  setSize(1200, 630);
  const rng3 = makeRng(0x5eed03);
  const og = renderOgFallback(rng3);
  const ogPath = path.join(PLACEHOLDER_DIR, 'og-fallback.webp');
  await mkdir(PLACEHOLDER_DIR, { recursive: true });
  await sharp(og, { raw: { width: 1200, height: 630, channels: 3 } })
    .webp({ quality: 82, effort: 6 })
    .toFile(ogPath);
  setSize(W_ANIM, H_ANIM);

  await writeFile(
    path.join(OUT_DIR, 'README.md'),
    `# Monitor loops

\`monitor-signal-sweep.webp\` and \`monitor-data-cascade.webp\` are generated by
\`scripts/generate-monitor-assets.mjs\` (\`npm run assets:monitor\`).

They are drawn procedurally from scratch — no photographic, film, or
third-party source material is involved. Released under
[CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/): no rights
reserved, no attribution required.

They replace two clips of commercial film footage that shipped with the
upstream theme. Regenerate rather than hand-edit, so provenance stays clear.

- ${W}x${H} (4:3, matching the widget's aspect-ratio)
- ${FRAMES} frames at ${DELAY_MS}ms, seamless loop
`
  );

  for (const p of [sweepPath, cascadePath]) {
    const m = await sharp(p, { animated: true }).metadata();
    const { size } = await sharp(p).stats().then(() => import('node:fs')).then((fs) => fs.statSync(p));
    console.log(
      `${path.basename(p).padEnd(30)} ${m.width}x${m.pageHeight}  ${m.pages} frames  ${(size / 1024).toFixed(0)}KB`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
