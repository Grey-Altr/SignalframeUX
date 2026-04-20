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

// Fraction of `count` appended as a clockwise-rotating duplicate of the
// outermost band. The base 6-band scheme keeps its current distribution
// (outermost CCW = 15.6% of `count`); these extras sit at the same radius
// range with rotDir = +1 so the outer ring reads as two counter-rotating
// layers interleaved. 0.156 matches the CCW outer band share for a
// visually balanced duplicate.
const OUTER_CW_DUP_SHARE = 0.156;

function initPoints(count: number, groupCount: number): Point[] {
  const GROUP_SLICE = (Math.PI * 2) / groupCount;
  const GROUP_SPREAD = 0.5;
  // sortReset feature plumbing retained for reversible disable; currently
  // zeroed so every particle participates in the sort pass at full strength.
  const groupSortReset = new Uint8Array(groupCount);
  const outerDupCount = Math.round(count * OUTER_CW_DUP_SHARE);
  const total = count + outerDupCount;
  const out: Point[] = new Array(total);
  for (let i = 0; i < count; i++) {
    const groupIdx = Math.floor((i * groupCount) / count);
    const groupCenter = groupIdx * GROUP_SLICE;
    const theta =
      groupCenter + (Math.random() - 0.5) * GROUP_SLICE * GROUP_SPREAD;
    const bucket = Math.random();
    let rJitter: number;
    let rotDir = 1;
    if (bucket < 0.18) {
      rJitter = (Math.random() - 0.5) * 0.04;
      rotDir = -1;
    } else if (bucket < 0.29) {
      rJitter = 0.022 + Math.random() * 0.118;
    } else if (bucket < 0.47) {
      rJitter = 0.142 + Math.random() * 0.236;
      rotDir = -1;
    } else if (bucket < 0.57) {
      rJitter = 0.38 + Math.random() * 0.236;
    } else if (bucket < 0.844) {
      rJitter = 0.618 + Math.random() * 0.472;
    } else {
      // Outermost band — originally 9% (bucket >= 0.91), now 15.6% of
      // particles (bucket >= 0.844). Two compounding bumps pulled from the
      // adjacent outer-mid band, which already bleeds into this radius.
      rJitter = 1.09 + Math.random() * 0.47;
      rotDir = -1;
    }
    const sortReset = groupSortReset[groupIdx] === 1 && rJitter < 0.38;
    out[i] = { theta, rJitter, groupIdx, rotDir, sortReset };
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
    out[count + k] = { theta, rJitter, groupIdx, rotDir: 1, sortReset: false };
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

  if (config.trail > 0) {
    offCtx.globalCompositeOperation = "destination-out";
    offCtx.fillStyle = `rgba(0, 0, 0, ${config.trail})`;
    offCtx.fillRect(0, 0, W, H);
    offCtx.globalCompositeOperation = "source-over";
  } else {
    offCtx.clearRect(0, 0, W, H);
  }
  offCtx.fillStyle = `oklch(${particleLCH} / 0.75)`;
  for (const p of pts) {
    if (p.sortReset) continue;
    const pr = r + breath + p.rJitter * thicknessScale;
    const angle = p.theta + rot * p.rotDir;
    const x = cx + Math.cos(angle) * pr;
    const y = cy + Math.sin(angle) * pr;
    const bandMul = p.rJitter >= 0.618 ? 0.76 : 1.0;
    offCtx.globalAlpha =
      groupIntensity[p.groupIdx] * groupFade[p.groupIdx] * bandMul;
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
