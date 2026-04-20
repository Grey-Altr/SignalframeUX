/// <reference lib="webworker" />
/**
 * PointcloudRing worker. Owns the entire render loop (particle update, draw,
 * pixel-sort) on the worker thread. Main thread only posts lifecycle events:
 * init (with transferred OffscreenCanvas + config), updateLCH (on theme
 * flip), updateGroups (on EntrySection re-roll), resize, visibility, destroy.
 *
 * Keep every piece of draw math bit-identical to the on-main-thread version
 * at components/dossier/pointcloud-ring.tsx — this is a pure relocation, not
 * a semantic change. If any constant drifts, the ring will look different.
 */
export {};

type Point = {
  theta: number;
  rJitter: number;
  groupIdx: number;
  rotDir: number;
  sortReset: boolean;
  /**
   * 0..RING_BAND_COUNT-1. Controls staged entrance reveal: each ring fades
   * in sequentially after the iris, 1s per band. Mapping:
   *   0 — core/center (bucket < 0.18)
   *   1 — inner bands (bucket 0.18 – 0.47)
   *   2 — mid band (bucket 0.47 – 0.844)
   *   3 — outermost (bucket >= 0.844 + CW duplicate)
   *   4 — far ring (beyond outermost)
   */
  bandIdx: number;
};

type InitConfig = {
  count: number;
  radius: number;
  trail: number;
  pixelSort: number;
  sortThreshold: number;
  borderRadius: number;
  borderAlpha: number;
  dpr: number;
  particleLCH: string;
  groups: { intensity: Float32Array; fade: Float32Array } | null;
  reduced: boolean;
};

type InitMsg = { type: "init"; canvas: OffscreenCanvas; config: InitConfig };
type UpdateLCHMsg = { type: "updateLCH"; particleLCH: string };
type UpdateGroupsMsg = {
  type: "updateGroups";
  intensity: Float32Array;
  fade: Float32Array;
};
type ResizeMsg = { type: "resize"; width: number; height: number; dpr: number };
type VisibilityMsg = { type: "visibility"; visible: boolean };
type DestroyMsg = { type: "destroy" };

type Msg =
  | InitMsg
  | UpdateLCHMsg
  | UpdateGroupsMsg
  | ResizeMsg
  | VisibilityMsg
  | DestroyMsg;

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let offscreen: OffscreenCanvas | null = null;
let offCtx: OffscreenCanvasRenderingContext2D | null = null;
let pts: Point[] = [];
let config: InitConfig | null = null;
let particleLCH = "0.96 0.01 90";
let groupIntensity: Float32Array = new Float32Array(0);
let groupFade: Float32Array = new Float32Array(0);
let running = false;
let rafId = 0;

// Radial trail modulation. The per-frame destination-out fade is baked
// into a pre-rendered OffscreenCanvas composed of angular wedges that
// emanate from canvas center: each wedge gets a random multiplier frozen
// on worker init, so some radial directions hold pixels long (persistent
// sorted streaks read as sunburst rays) while others clear fast. Drawn
// every frame as a single drawImage blit — cheaper than the N-fillRect
// band approach it replaces.
const TRAIL_WEDGE_COUNT = 64;
const TRAIL_MUL_MIN = 0.25;
const TRAIL_MUL_MAX = 2.0;
// Random bias curve for per-wedge trail persistence. The multiplier feeds
// a destination-out fade, so LOWER multiplier = LONGER trail. Raising the
// exponent pulls Math.random() toward 0 → more wedges land near MIN →
// overall longer trails. 1.0 = uniform, 2.0 = quadratic pull toward MIN,
// 3.0 = cubic (strongly weighted toward the longest trails).
const TRAIL_MUL_EXP = 2;
// Post-bake Gaussian blur applied to the conic-gradient trail map. The
// conic already interpolates linearly between stops; this pass softens
// those transitions into a Gaussian fall-off, dissolving any last sense
// of discrete wedge boundaries and giving the radial modulation a
// continuous atmospheric quality.
const TRAIL_BLUR_PX = 72;
const trailWedgeMul = new Float32Array(TRAIL_WEDGE_COUNT);
let trailMap: OffscreenCanvas | null = null;
let frameIdx = 0;
let anchor = 0;
let lastDrawTs = 0;

const WARMUP_FRAMES = 180;
const FRAME_MS = 1000 / 60;
// Cap draw rate at 60 FPS even when the compositor vsyncs at 120/144Hz.
// Trails (config.trail) and pixel-sort progression were tuned for 60; running
// faster bleeds trails out too quickly and burns CPU for no visible gain on
// the common 60Hz display. 0.5ms slack avoids losing a frame that lands just
// shy of the budget due to rAF jitter.
const DRAW_INTERVAL_MS = FRAME_MS - 0.5;

/**
 * Bake the per-wedge trail alpha into an OffscreenCanvas sized to the
 * live ring canvas. Uses a conic gradient anchored at canvas center with
 * one color stop per wedge multiplier — the browser linearly interpolates
 * alpha between adjacent stops, so wedge boundaries feather smoothly
 * instead of appearing as hard radial seams. On resize, regenerated
 * against the same frozen multiplier table so the radial pattern is
 * stable across the session.
 */
function buildTrailMap(W: number, H: number, trail: number): OffscreenCanvas {
  // Stage 1 — render the raw conic gradient to a scratch canvas.
  const scratch = new OffscreenCanvas(W, H);
  const sctx = scratch.getContext("2d");
  if (!sctx) return scratch;
  const cx = W / 2;
  const cy = H / 2;
  const grad = sctx.createConicGradient(0, cx, cy);
  for (let w = 0; w < TRAIL_WEDGE_COUNT; w++) {
    const stop = w / TRAIL_WEDGE_COUNT;
    const alpha = Math.min(1, trail * trailWedgeMul[w]);
    grad.addColorStop(stop, `rgba(0, 0, 0, ${alpha})`);
  }
  // Close the loop back to the first wedge so the 0°/360° seam blends
  // through the same gradient math as every other boundary.
  const closingAlpha = Math.min(1, trail * trailWedgeMul[0]);
  grad.addColorStop(1, `rgba(0, 0, 0, ${closingAlpha})`);
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, W, H);

  // Stage 2 — blit the gradient through a Gaussian filter into the final
  // trail map. OffscreenCanvas 2D `filter` is supported in Chromium, Safari
  // 16.4+, Firefox 105+ (same matrix as OffscreenCanvas itself).
  const map = new OffscreenCanvas(W, H);
  const mctx = map.getContext("2d");
  if (!mctx) return scratch;
  mctx.filter = `blur(${TRAIL_BLUR_PX}px)`;
  mctx.drawImage(scratch, 0, 0);
  mctx.filter = "none";
  return map;
}

// Fraction of `count` appended as a clockwise-rotating duplicate of the
// outermost band. The base 6-band scheme keeps its current distribution
// (outermost CCW = 15.6% of `count`); these extras sit at the same radius
// range with rotDir = +1 so the outer ring reads as two counter-rotating
// layers interleaved. 0.156 matches the CCW outer band share for a
// visually balanced duplicate.
const OUTER_CW_DUP_SHARE = 0.156;
// Second "far" ring sitting just outside the existing outermost band. Same
// radial width (0.47 in rJitter units). Started at 25% of the full outer
// band's density (0.312 × 0.25 = 0.078) then stepped up 50% to 0.117 of
// count (~491 particles at count=4200). Density is exponentially biased
// toward the outside boundary: with α=3 the outer edge is ≈ e^3 ≈ 20×
// denser than the inner edge of this ring.
// Rotation splits 50/50 between CCW (rotDir=-1) and CW (rotDir=+1).
const FAR_RING_SHARE = 0.117;
const FAR_RING_EXP_ALPHA = 3;

// Staged entrance reveal. The iris canvas owns the first 2s (pure CSS fade
// on the iris wrapper). Rings start fading in at t=2s, one band at a time,
// 1s per band — five bands (see Point.bandIdx) → rings fully visible at
// t=7s. After that the rest of the hero constructs in parallel.
const RING_REVEAL_OFFSET_S = 2;
const RING_BAND_DURATION_S = 1;
const RING_BAND_COUNT = 5;
let revealStartedAt = 0;
const bandAlphaTable = new Float32Array(RING_BAND_COUNT);

function initPoints(count: number, groupCount: number): Point[] {
  const GROUP_SLICE = (Math.PI * 2) / groupCount;
  const GROUP_SPREAD = 0.5;
  // sortReset feature plumbing retained for reversible disable; currently
  // zeroed so every particle participates in the sort pass at full strength.
  const groupSortReset = new Uint8Array(groupCount);
  const outerDupCount = Math.round(count * OUTER_CW_DUP_SHARE);
  const farCount = Math.round(count * FAR_RING_SHARE);
  const total = count + outerDupCount + farCount;
  const out: Point[] = new Array(total);
  for (let i = 0; i < count; i++) {
    const groupIdx = Math.floor((i * groupCount) / count);
    const groupCenter = groupIdx * GROUP_SLICE;
    const theta =
      groupCenter + (Math.random() - 0.5) * GROUP_SLICE * GROUP_SPREAD;
    const bucket = Math.random();
    let rJitter: number;
    let rotDir = 1;
    let bandIdx: number;
    if (bucket < 0.18) {
      rJitter = (Math.random() - 0.5) * 0.04;
      rotDir = -1;
      bandIdx = 0;
    } else if (bucket < 0.29) {
      rJitter = 0.022 + Math.random() * 0.118;
      bandIdx = 1;
    } else if (bucket < 0.47) {
      rJitter = 0.142 + Math.random() * 0.236;
      rotDir = -1;
      bandIdx = 1;
    } else if (bucket < 0.57) {
      rJitter = 0.38 + Math.random() * 0.236;
      bandIdx = 2;
    } else if (bucket < 0.844) {
      rJitter = 0.618 + Math.random() * 0.472;
      bandIdx = 2;
    } else {
      // Outermost band — originally 9% (bucket >= 0.91), now 15.6% of
      // particles (bucket >= 0.844). Two compounding bumps pulled from the
      // adjacent outer-mid band, which already bleeds into this radius.
      rJitter = 1.09 + Math.random() * 0.47;
      rotDir = -1;
      bandIdx = 3;
    }
    const sortReset = groupSortReset[groupIdx] === 1 && rJitter < 0.38;
    out[i] = { theta, rJitter, groupIdx, rotDir, sortReset, bandIdx };
  }
  // Clockwise duplicate of the outermost band — same radius range, opposite
  // rotation. Theta is redistributed across groups independently so the CW
  // layer isn't angularly co-located with the CCW one.
  for (let k = 0; k < outerDupCount; k++) {
    const groupIdx = Math.floor((k * groupCount) / outerDupCount);
    const groupCenter = groupIdx * GROUP_SLICE;
    const theta =
      groupCenter + (Math.random() - 0.5) * GROUP_SLICE * GROUP_SPREAD;
    const rJitter = 1.09 + Math.random() * 0.47;
    out[count + k] = {
      theta,
      rJitter,
      groupIdx,
      rotDir: 1,
      sortReset: false,
      bandIdx: 3,
    };
  }
  // Far ring — one band-width outside the outermost (rJitter 1.56–2.03),
  // exponentially denser along the outer edge via inverse-CDF sampling of
  // an exponential distribution (density(x) ∝ e^(αx) on [0,1], α=3).
  // Rotation coin-flips per particle so the layer reads as a turbulent
  // shell rather than a coherent stream.
  const farExpScale = Math.exp(FAR_RING_EXP_ALPHA) - 1;
  for (let k = 0; k < farCount; k++) {
    const groupIdx = Math.floor((k * groupCount) / farCount);
    const groupCenter = groupIdx * GROUP_SLICE;
    const theta =
      groupCenter + (Math.random() - 0.5) * GROUP_SLICE * GROUP_SPREAD;
    const u = Math.random();
    const x01 = Math.log(1 + u * farExpScale) / FAR_RING_EXP_ALPHA;
    const rJitter = 1.56 + 0.47 * x01;
    const rotDir = Math.random() < 0.5 ? -1 : 1;
    out[count + outerDupCount + k] = {
      theta,
      rJitter,
      groupIdx,
      rotDir,
      sortReset: false,
      bandIdx: 4,
    };
  }
  return out;
}

function draw(now: number): void {
  if (!ctx || !offCtx || !canvas || !offscreen || !config) return;
  frameIdx++;
  const t = (now - anchor) / 1000;
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const canvasR = Math.min(W, H);
  const thicknessScale = canvasR * 0.42;
  const breath = Math.sin(t * 0.05) * 0.04 * thicknessScale;
  const rot = config.reduced ? 0 : t * 0.03;
  const r = canvasR * config.radius;
  const dpr = config.dpr;

  // Per-band reveal alpha for the staged entrance. Computed once per frame,
  // indexed by Point.bandIdx in the draw loop. Ease-out cubic so bands
  // bloom in rather than linearly crossfade.
  const revealElapsed = (now - revealStartedAt) / 1000;
  for (let b = 0; b < RING_BAND_COUNT; b++) {
    const bandStart = RING_REVEAL_OFFSET_S + b * RING_BAND_DURATION_S;
    const progress = Math.max(
      0,
      Math.min(1, (revealElapsed - bandStart) / RING_BAND_DURATION_S),
    );
    const inv = 1 - progress;
    bandAlphaTable[b] = 1 - inv * inv * inv;
  }

  if (config.trail > 0 && trailMap) {
    offCtx.globalCompositeOperation = "destination-out";
    offCtx.drawImage(trailMap, 0, 0);
    offCtx.globalCompositeOperation = "source-over";
  } else {
    offCtx.clearRect(0, 0, W, H);
  }
  offCtx.fillStyle = `oklch(${particleLCH} / 0.75)`;
  for (const p of pts) {
    if (p.sortReset) continue;
    const revealAlpha = bandAlphaTable[p.bandIdx];
    if (revealAlpha <= 0) continue;
    const pr = r + breath + p.rJitter * thicknessScale;
    const angle = p.theta + rot * p.rotDir;
    const x = cx + Math.cos(angle) * pr;
    const y = cy + Math.sin(angle) * pr;
    const bandMul = p.rJitter >= 0.618 ? 0.76 : 1.0;
    offCtx.globalAlpha =
      groupIntensity[p.groupIdx] *
      groupFade[p.groupIdx] *
      bandMul *
      revealAlpha;
    offCtx.fillRect(x, y, 1 * dpr, 1 * dpr);
  }
  offCtx.globalAlpha = 1;

  if (config.borderRadius > 0) {
    const layers = 7;
    const spanPx = 3;
    for (let i = 0; i < layers; i++) {
      const norm = (i - (layers - 1) / 2) / ((layers - 1) / 2);
      const offsetPx = norm * spanPx * dpr;
      const alpha = (1 - Math.abs(norm)) * config.borderAlpha;
      if (alpha <= 0.02) continue;
      offCtx.strokeStyle = `oklch(${particleLCH} / ${alpha.toFixed(3)})`;
      offCtx.lineWidth = 1 * dpr;
      offCtx.beginPath();
      offCtx.arc(
        cx,
        cy,
        canvasR * config.borderRadius + offsetPx,
        0,
        Math.PI * 2,
      );
      offCtx.stroke();
    }
  }

  if (config.pixelSort > 0 && !config.reduced) {
    const chunkSize = Math.max(1, Math.round(H * config.pixelSort));
    const rowStart = (frameIdx * chunkSize) % H;
    const rowEnd = Math.min(H, rowStart + chunkSize);
    const rowCount = rowEnd - rowStart;
    const img = offCtx.getImageData(0, rowStart, W, rowCount);
    const data = img.data;
    const u32 = new Uint32Array(data.buffer, data.byteOffset, W * rowCount);
    const cmpAsc = (a: number, b: number) => (a >>> 24) - (b >>> 24);
    const cmpDesc = (a: number, b: number) => (b >>> 24) - (a >>> 24);

    for (let y = 0; y < rowCount; y++) {
      const rowBaseU32 = y * W;
      const rowBaseBytes = y * W * 4;
      const cmp = (rowStart + y) & 1 ? cmpDesc : cmpAsc;
      let runStart = -1;
      for (let x = 0; x <= W; x++) {
        const bright =
          x < W && data[rowBaseBytes + x * 4 + 3] > config.sortThreshold;
        if (bright && runStart === -1) {
          runStart = x;
        } else if (!bright && runStart !== -1) {
          u32.subarray(rowBaseU32 + runStart, rowBaseU32 + x).sort(cmp);
          runStart = -1;
        }
      }
    }
    offCtx.putImageData(img, 0, rowStart);
  }

  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(offscreen, 0, 0);
  ctx.fillStyle = `oklch(${particleLCH} / 0.75)`;
  for (const p of pts) {
    if (!p.sortReset) continue;
    const pr = r + breath + p.rJitter * thicknessScale;
    const angle = p.theta + rot * p.rotDir;
    const x = cx + Math.cos(angle) * pr;
    const y = cy + Math.sin(angle) * pr;
    const bandMul = p.rJitter >= 0.618 ? 0.76 : 1.0;
    ctx.globalAlpha =
      groupIntensity[p.groupIdx] * groupFade[p.groupIdx] * bandMul;
    ctx.fillRect(x, y, 1 * dpr, 1 * dpr);
  }
  ctx.globalAlpha = 1;
}

function tick(now: number): void {
  if (now - lastDrawTs >= DRAW_INTERVAL_MS) {
    lastDrawTs = now;
    draw(now);
  }
  rafId = self.requestAnimationFrame(tick);
}

function startAnim(): void {
  if (running) return;
  running = true;
  lastDrawTs = 0;
  rafId = self.requestAnimationFrame(tick);
}

function stopAnim(): void {
  if (!running) return;
  running = false;
  self.cancelAnimationFrame(rafId);
}

const GROUPS_CHANNEL = "sf-hero-shared-groups";
let groupChannel: BroadcastChannel | null = null;

function handleInit(msg: InitMsg): void {
  canvas = msg.canvas;
  config = msg.config;
  particleLCH = msg.config.particleLCH;

  ctx = canvas.getContext("2d");
  if (!ctx) return;

  offscreen = new OffscreenCanvas(canvas.width, canvas.height);
  offCtx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!offCtx) return;

  if (msg.config.groups) {
    groupIntensity = msg.config.groups.intensity;
    groupFade = msg.config.groups.fade;
  } else {
    const arrLen = Math.ceil(config.count / 33);
    groupIntensity = new Float32Array(arrLen);
    groupFade = new Float32Array(arrLen);
    for (let g = 0; g < arrLen; g++) {
      groupIntensity[g] =
        Math.random() < 0.33 ? 0.4 + Math.random() * 1.2 : 1.0;
      groupFade[g] = Math.random() < 0.33 ? 0.3 + Math.random() * 0.4 : 1.0;
    }
  }

  pts = initPoints(config.count, groupIntensity.length);

  // Subscribe to cross-worker group updates (EntrySection broadcasts on
  // every 13s re-roll; ring + iris workers both pick them up so wedges
  // stay coherent across layers).
  groupChannel = new BroadcastChannel(GROUPS_CHANNEL);
  groupChannel.addEventListener("message", (e: MessageEvent) => {
    const d = e.data as { intensity?: Float32Array; fade?: Float32Array };
    if (d.intensity) groupIntensity = d.intensity;
    if (d.fade) groupFade = d.fade;
  });

  // Shift anchor back by warmup span so the first visible frame lands at a
  // mid-rotation t, not t=0. Warmup *draws* are intentionally skipped — the
  // full-canvas pixel-sort pass made this a ~1.4s synchronous block before
  // the first real frame could tick, which read as "animation takes a while
  // to load". Trail now builds organically in ~30 rAF frames once running,
  // which fits the exposed-construction register anyway.
  anchor = performance.now() - WARMUP_FRAMES * FRAME_MS;
  // Reveal clock starts at worker init — rings begin fading in at
  // performance.now() + RING_REVEAL_OFFSET_S * 1000. Decoupled from `anchor`
  // (which is back-shifted by warmup span) so reveal math stays simple.
  revealStartedAt = performance.now();

  // Freeze the per-wedge trail multipliers at load. Regenerating these
  // would re-shuffle the radial persistence pattern mid-run, which reads
  // as a glitch. Resize regenerates the bitmap but keeps these values.
  // TRAIL_MUL_EXP biases Math.random() toward 0, concentrating wedges at
  // the low-multiplier end so the majority of radial directions hold
  // pixels longer (longer sunburst-ray persistence).
  for (let w = 0; w < TRAIL_WEDGE_COUNT; w++) {
    const biased = Math.random() ** TRAIL_MUL_EXP;
    trailWedgeMul[w] =
      TRAIL_MUL_MIN + biased * (TRAIL_MUL_MAX - TRAIL_MUL_MIN);
  }
  trailMap = buildTrailMap(canvas.width, canvas.height, config.trail);

  // Tick starts immediately. Main-thread IntersectionObserver may send an
  // early `visibility: false` if the canvas happens to be offscreen; that
  // will land on the message queue and pause us on the first event tick.
  startAnim();
}

self.onmessage = (e: MessageEvent<Msg>): void => {
  const msg = e.data;
  switch (msg.type) {
    case "init":
      handleInit(msg);
      break;
    case "updateLCH":
      particleLCH = msg.particleLCH;
      break;
    case "updateGroups":
      groupIntensity = msg.intensity;
      groupFade = msg.fade;
      break;
    case "resize": {
      if (!canvas || !offscreen) return;
      if (config) config.dpr = msg.dpr;
      canvas.width = Math.round(msg.width * msg.dpr);
      canvas.height = Math.round(msg.height * msg.dpr);
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      // Rebuild the radial trail map at the new dims using the existing
      // frozen wedge multipliers so the pattern stays stable.
      if (config) {
        trailMap = buildTrailMap(canvas.width, canvas.height, config.trail);
      }
      break;
    }
    case "visibility":
      if (msg.visible) startAnim();
      else stopAnim();
      break;
    case "destroy":
      stopAnim();
      groupChannel?.close();
      groupChannel = null;
      self.close();
      break;
  }
};
