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
let lastDrawTs = 0;

const WARMUP_FRAMES = 180;
const FRAME_MS = 1000 / 60;
// Cap draw rate at 60 FPS — see pointcloud-ring-worker.ts for rationale
// (trails tuned for 60, no gain on 60Hz displays, unified look across
// 120/144Hz monitors).
const DRAW_INTERVAL_MS = FRAME_MS - 0.5;

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

  if (config.trail > 0) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0, 0, 0, ${config.trail})`;
    ctx.fillRect(0, 0, W, H);
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

  if (config.pixelSort > 0 && !config.reduced) {
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

  anchor = performance.now() - WARMUP_FRAMES * FRAME_MS;
  for (let i = 0; i < WARMUP_FRAMES; i++) {
    draw(anchor + i * FRAME_MS);
  }

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
