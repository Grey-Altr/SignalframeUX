// lib/system-stats.ts
// Single source of truth for key system stats.
// Used by: AcquisitionSection (Phase 33), ProofSection (Phase 33 refactor), and any future consumer.
//
// COMPONENTS: Object.keys(COMPONENT_REGISTRY).length — derived at module load time, not hardcoded.
//             If registry grows, the count updates automatically on next build.
// BUNDLE:     last confirmed gzip shared bundle from `ANALYZE=true pnpm build` at v1.4 gate — 100KB
// LIGHTHOUSE: confirmed 100/100 all categories against deployed URL at v1.4 ship
//
// To update: run `ANALYZE=true pnpm build`, read .next/analyze/client.html for gzip size,
// run Lighthouse against https://signalframeux.vercel.app/, update values below.

import { COMPONENT_REGISTRY } from "./component-registry";

export const SYSTEM_STATS = {
  components: Object.keys(COMPONENT_REGISTRY).length,
  bundle: "100KB",   // last measured: v1.4 gate — 100.0 KB gzip shared bundle
  lighthouse: "100", // last confirmed: v1.4 deployed URL, all four categories
} as const;
