/**
 * API documentation data for all SignalframeUX components and utilities.
 * Each entry maps to a nav item in the API Explorer sidebar.
 *
 * AUTO-GENERATED — do not edit by hand.
 * Run: pnpm docs:generate
 * Source: scripts/generate-api-docs.ts
 * Generated: 2026-04-24T01:17:51.231Z
 */

import type { ComponentDoc, PropDef, UsageExample, PreviewHud } from "./api-docs/types";
export type { ComponentDoc, PropDef, UsageExample, PreviewHud };
import { FRAME_DOCS } from "./api-docs/frame";
import { SIGNAL_DOCS } from "./api-docs/signal";
import { CORE_DOCS } from "./api-docs/core";
import { HOOK_DOCS } from "./api-docs/hook";

export const API_DOCS: Record<string, ComponentDoc> = {
  ...FRAME_DOCS,
  ...SIGNAL_DOCS,
  ...CORE_DOCS,
  ...HOOK_DOCS,
};
