// lib/component-registry.ts
// Pure data module — no client directive, no React imports, safe for Server Components
// Consumed by Phase 25 ComponentDetail panel for variant previews, code snippets, and doc pointer lookups

import type { ComponentRegistryEntry, VariantPreview } from "./registry/types";
import { FORMS } from "./registry/forms";
import { LAYOUT } from "./registry/layout";
import { NAVIGATION } from "./registry/navigation";
import { FEEDBACK } from "./registry/feedback";
import { DATA_DISPLAY } from "./registry/data-display";
import { GENERATIVE } from "./registry/generative";

export type { ComponentRegistryEntry, VariantPreview };

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryEntry> = {
  ...FORMS,
  ...LAYOUT,
  ...NAVIGATION,
  ...FEEDBACK,
  ...DATA_DISPLAY,
  ...GENERATIVE,
};
