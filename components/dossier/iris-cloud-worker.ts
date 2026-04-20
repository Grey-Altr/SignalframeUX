/// <reference lib="webworker" />
/**
 * IrisCloud worker. Mirror of pointcloud-ring-worker but for the inward-
 * drifting iris cloud — simpler geometry (single draw pass, no offscreen
 * composite, no border), same pixel-sort pass + shared-groups protocol.
 *
 * Draw math copied byte-for-byte from the on-main-thread path at
 * components/dossier/iris-cloud.tsx. This is a pure relocation.
 */
export {};

type Point = {
  theta: number;
  phase: number;
  speed: number;
  groupIdx: number;
};

type InitConfig = {
  count: number;
  outerRadius: number;
  innerRadius: number;
  trail: number;
  pixelSort: number;
  sortThreshold: number;
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

const GROUPS_CHANNEL = "sf-hero-shared-groups";
let groupChannel: BroadcastChannel | null = null;

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let pts: Point[] = [];
let config: InitConfig | null = null;
let particleLCH = "0.96 0.01 90";
let groupIntensity: Float32Array = new Float32Array(0);
let groupFade: Float32Array = new Float32Array(0);
let running = false;
let rafId = 0;
let frameIdx = 0;
let anchor = 0;
// Pixel-sort start gate. See pointcloud-ring-worker.ts for rationale —
// sorted streaks activate 6s after the hero entrance sequence completes
// so the // slash's shadow stays quiet until then, then comes alive.
const PIXEL_SORT_START_S = 16;
let revealStartedAt = 0;
let lastDrawTs = 0;

const WARMUP_FRAMES = 180;
const FRAME_MS = 1000 / 60;
// Cap draw rate at 60 FPS — see pointcloud-ring-worker.ts for rationale
// (trails tuned for 60, no gain on 60Hz displays, unified look across
// 120/144Hz monitors).
const DRAW_INTERVAL_MS = FRAME_MS - 0.5;

// Radial trail modulation — wedges emanate from canvas center, each
// holding pixels for a different number of frames. See the ring worker
// for the full rationale; iris uses an independent random seed so the
// two layers don't visually align.
const TRAIL_WEDGE_COUNT = 64;
const TRAIL_MUL_MIN = 0.25;
const TRAIL_MUL_MAX = 2.0;
const TRAIL_BLUR_PX = 72;
const trailWedgeMul = new Float32Array(TRAIL_WEDGE_COUNT);
let trailMap: OffscreenCanvas | null = null;

function buildTrailMap(W: number, H: number, trail: number): OffscreenCanvas {
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
  const closingAlpha = Math.min(1, trail * trailWedgeMul[0]);
  grad.addColorStop(1, `rgba(0, 0, 0, ${closingAlpha})`);
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, W, H);

  const map = new OffscreenCanvas(W, H);
  const mctx = map.getContext("2d");
  if (!mctx) return scratch;
  mctx.filter = `blur(${TRAIL_BLUR_PX}px)`;
  mctx.drawImage(scratch, 0, 0);
  mctx.filter = "none";
  return map;
}

function initPoints(count: number, groupCount: number): Point[] {
  const out: Point[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const groupIdx =
      groupCount > 0
        ? Math.floor((theta / (Math.PI * 2)) * groupCount) % groupCount
        : -1;
    out[i] = {
      theta,
      phase: Math.random(),
      speed: 0.6 + Math.random() * 0.8,
      groupIdx,
    };
  }
  return out;
}

function draw(now: number): void {
  if (!ctx || !canvas || !config) return;
  frameIdx++;
  const t = (now - anchor) / 1000;
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const rOuter = Math.min(W, H) * config.outerRadius;
  const rInner = Math.min(W, H) * config.innerRadius;
  const dpr = config.dpr;

  if (config.trail > 0 && trailMap) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(trailMap, 0, 0);
    ctx.globalCompositeOperation = "source-over";
  } else {
    ctx.clearRect(0, 0, W, H);
  }
  ctx.fillStyle = `oklch(${particleLCH} / 0.3)`;
  for (const p of pts) {
    const life = config.reduced
      ? p.phase
      : (p.phase + t * p.speed * 0.04) % 1;
    const edgeFade = life < 0.9 ? 1 : (1 - life) / 0.1;
    const r01 = 1 - life;
    const r = rInner + (rOuter - rInner) * r01;
    const x = cx + Math.cos(p.theta) * r;
    const y = cy + Math.sin(p.theta) * r;
    const groupMul =
      p.groupIdx >= 0
        ? groupIntensity[p.groupIdx] * groupFade[p.groupIdx]
        : 1;
    ctx.globalAlpha = edgeFade * groupMul;
    ctx.fillRect(x, y, 1 * dpr, 1 * dpr);
  }
  ctx.globalAlpha = 1;

  const revealElapsed = (now - revealStartedAt) / 1000;
  if (
    config.pixelSort > 0 &&
    !config.reduced &&
    revealElapsed > PIXEL_SORT_START_S
  ) {
    const chunkSize = Math.max(1, Math.round(H * config.pixelSort));
    const rowStart = (frameIdx * chunkSize) % H;
    const rowEnd = Math.min(H, rowStart + chunkSize);
    const rowCount = rowEnd - rowStart;
    const img = ctx.getImageData(0, rowStart, W, rowCount);
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
    ctx.putImageData(img, 0, rowStart);
  }
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

function handleInit(msg: InitMsg): void {
  canvas = msg.canvas;
  config = msg.config;
  particleLCH = msg.config.particleLCH;

  ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  if (msg.config.groups) {
    groupIntensity = msg.config.groups.intensity;
    groupFade = msg.config.groups.fade;
  }

  pts = initPoints(config.count, groupIntensity.length);

  groupChannel = new BroadcastChannel(GROUPS_CHANNEL);
  groupChannel.addEventListener("message", (e: MessageEvent) => {
    const d = e.data as { intensity?: Float32Array; fade?: Float32Array };
    if (d.intensity) groupIntensity = d.intensity;
    if (d.fade) groupFade = d.fade;
  });

  // See pointcloud-ring-worker.ts — synthetic warmup draws skipped to unblock
  // first real frame; anchor kept so t starts mid-cycle.
  anchor = performance.now() - WARMUP_FRAMES * FRAME_MS;
  // Reveal clock for pixel-sort gate (PIXEL_SORT_START_S).
  revealStartedAt = performance.now();

  // Freeze the per-wedge trail multipliers at load, build the radial map.
  for (let w = 0; w < TRAIL_WEDGE_COUNT; w++) {
    trailWedgeMul[w] =
      TRAIL_MUL_MIN + Math.random() * (TRAIL_MUL_MAX - TRAIL_MUL_MIN);
  }
  trailMap = buildTrailMap(canvas.width, canvas.height, config.trail);

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
      if (!canvas) return;
      if (config) config.dpr = msg.dpr;
      canvas.width = Math.round(msg.width * msg.dpr);
      canvas.height = Math.round(msg.height * msg.dpr);
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
