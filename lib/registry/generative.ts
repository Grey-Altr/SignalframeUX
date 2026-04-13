import type { ComponentRegistryEntry } from "./types";

export const GENERATIVE: Record<string, ComponentRegistryEntry> = {
  // ── GENERATIVE (Pattern C — animation components, no Radix base) ───────────

  "101": {
    index: "101",
    name: "NOISE_BG",
    component: "NoiseBg",
    importPath: "@/components/animation/noise-bg",
    variants: [
      { label: "DEFAULT",   props: { opacity: 0.15 } },
      { label: "INTENSE",   props: { opacity: 0.35 } },
    ],
    code: `import NoiseBg from '@/components/animation/noise-bg'

<div className="relative">
  <NoiseBg opacity={0.15} />
  CONTENT
</div>`,
    docId: "noiseBg",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },

  "102": {
    index: "102",
    name: "WAVEFORM",
    component: "Waveform",
    importPath: "@/components/animation/waveform",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import Waveform from '@/components/animation/waveform'

<Waveform />`,
    docId: "waveformSignal",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },

  "103": {
    index: "103",
    name: "GLITCH_TXT",
    component: "GlitchText",
    importPath: "@/components/animation/glitch-text",
    variants: [
      { label: "DEFAULT", props: { children: "SIGNAL" } },
    ],
    code: `import GlitchText from '@/components/animation/glitch-text'

<GlitchText>SIGNAL ACTIVE</GlitchText>`,
    docId: "glitchTextSignal",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },

  "104": {
    index: "104",
    name: "PARTICLE",
    component: "ParticleMesh",
    importPath: "@/components/animation/particle-mesh",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import ParticleMesh from '@/components/animation/particle-mesh'

<ParticleMesh />`,
    docId: "particleMesh",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },

  // Reconciled in Phase 33 — shipped components added to registry
  // Both exist in components/animation/ and are Pattern C GENERATIVE components
  "105": {
    index: "105",
    name: "SCRAMBLE_TEXT",
    component: "ScrambleText",
    importPath: "@/components/animation/scramble-text",
    variants: [
      { label: "DEFAULT", props: { text: "SIGNAL ACTIVE" } },
    ],
    code: `import ScrambleText from '@/components/animation/scramble-text'

<ScrambleText text="SIGNAL ACTIVE" />`,
    docId: "scrambleText",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },

  "106": {
    index: "106",
    name: "CIRCUIT_DIVIDER",
    component: "CircuitDivider",
    importPath: "@/components/animation/circuit-divider",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import CircuitDivider from '@/components/animation/circuit-divider'

<CircuitDivider />`,
    docId: "circuitDivider",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },
};
