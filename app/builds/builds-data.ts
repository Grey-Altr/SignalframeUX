export type BuildDetail = {
  slug: string;
  code: string;
  title: string;
  subject: string;
  concept: string;
  frameUse: string;
  signalUse: string;
  status: string;
  toneClass: string;
  mission: string;
  frameStack: string[];
  signalStack: string[];
  interactionModel: string[];
  output: string;
  registerLabel: string;
  frameHeading: string;
  signalHeading: string;
  interactionHeading: string;
  outputLabel: string;
  operatorNote: string;
};

export const BUILDS: BuildDetail[] = [
  {
    slug: "sonic-pressure-map",
    code: "BLD-01",
    title: "SONIC PRESSURE MAP",
    subject: "CLUB ENERGY CARTOGRAPHY",
    concept:
      "A live event map that tracks crowd intensity per zone and converts movement density into a directional reading surface.",
    frameUse:
      "Uses rigid SF table + status layout for deterministic floor safety telemetry and clear zone ownership.",
    signalUse:
      "Adds restrained datamosh overlays that pulse only on threshold crossings so urgency is felt without blurring legibility.",
    status: "CONCEPT / EVENT TOOL",
    toneClass: "border-primary/50 bg-primary/5",
    mission:
      "Translate floor movement into an operator-grade surface where crowd dynamics are legible in under two seconds.",
    frameStack: [
      "Zone index table with strict row hierarchy and fixed warning columns.",
      "Pinned command rail for ingress, egress, and hold-state decisions.",
      "Deterministic typography scale for low-light readability.",
    ],
    signalStack: [
      "Threshold-triggered pulse fields mapped to density spikes.",
      "Low-opacity datamosh sweep only during rapid directional reversal.",
      "Signal intensity lock to avoid escalation during normal variance.",
    ],
    interactionModel: [
      "Operator scans frame table first.",
      "Signal events annotate priority zones.",
      "Action lane proposes route correction.",
    ],
    output: "Night operations dashboard for venue floor controllers.",
    registerLabel: "FLOOR CONTROL REGISTER",
    frameHeading: "FRAME CONTROL STACK",
    signalHeading: "SIGNAL ALERT STACK",
    interactionHeading: "RUNTIME DECISION LOOP",
    outputLabel: "DEPLOYMENT SURFACE",
    operatorNote:
      "Keep one eye on the threshold rail and one eye on the exits. If the wave spikes twice, reroute early.",
  },
  {
    slug: "ritual-poster-engine",
    code: "BLD-02",
    title: "RITUAL POSTER ENGINE",
    subject: "EVENT IDENTITY SYSTEM",
    concept:
      "A campaign generator that outputs weekly show posters from a fixed typographic frame and rotating artist signal inputs.",
    frameUse:
      "Relies on SF grid constraints and immutable type tokens to keep every export structurally on-brand.",
    signalUse:
      "Injects controlled hue drift and scanline accents based on lineup tempo, creating per-night variance inside one system.",
    status: "CONCEPT / PUBLISHING MOD",
    toneClass: "border-[var(--sf-yellow)]/50 bg-[var(--sf-yellow)]/10",
    mission:
      "Generate poster drops that feel singular each week while preserving one codified structural signature.",
    frameStack: [
      "Locked headline zones and schedule rail.",
      "Tokenized spacing rhythm for all copy blocks.",
      "Export-safe frame guides for print and social cuts.",
    ],
    signalStack: [
      "Hue drift from BPM profile of lineup set.",
      "Scanline emphasis weighted by billing order.",
      "Symbolic noise passes to mark late-stage edits.",
    ],
    interactionModel: [
      "Producer selects lineup metadata.",
      "Engine composes deterministic frame.",
      "Signal pass applies controlled variance.",
    ],
    output: "Poster batch generator for campaign continuity.",
    registerLabel: "CAMPAIGN REGISTER",
    frameHeading: "FRAME COMPOSITION STACK",
    signalHeading: "SIGNAL STYLING STACK",
    interactionHeading: "GENERATIVE COMPOSITION FLOW",
    outputLabel: "PUBLISHING OUTPUT",
    operatorNote:
      "The grid is law. Let the lineup breathe through color drift, but never let rhythm break the masthead.",
  },
  {
    slug: "operator-wardrobe-skin",
    code: "BLD-03",
    title: "OPERATOR WARDROBE SKIN",
    subject: "PERSONAL SIGNAL MOD",
    concept:
      "A user-installed theme pack that maps outfit categories to interface states for a day-to-night operating profile.",
    frameUse:
      "Keeps all controls in strict SF component anatomy so interaction cost stays identical across every skin.",
    signalUse:
      "Shifts accent cadence, ghost labels, and divider symbols according to selected persona mode: PREP, LIVE, DEBRIEF.",
    status: "CONCEPT / USER THEME",
    toneClass: "border-foreground/40 bg-foreground/5",
    mission:
      "Allow personal identity expression without changing the cognitive map of the core interface.",
    frameStack: [
      "Unchanged SF primitives and interaction affordances.",
      "State-safe token boundaries across all form controls.",
      "Mode contract that forbids structure drift.",
    ],
    signalStack: [
      "Persona-based accent tempo modulation.",
      "Divider symbol swaps by operating context.",
      "Ambient overlays tied to time-window presets.",
    ],
    interactionModel: [
      "User selects persona profile.",
      "Frame remains fixed.",
      "Signal layer remaps expressive surface.",
    ],
    output: "Theme modulation pack for identity-preserving workflows.",
    registerLabel: "PERSONA REGISTER",
    frameHeading: "FRAME CONTINUITY STACK",
    signalHeading: "SIGNAL PERSONA STACK",
    interactionHeading: "IDENTITY MODE FLOW",
    outputLabel: "MOD PACKAGE",
    operatorNote:
      "Switch persona, not posture. The interface should feel different, not harder to read.",
  },
  {
    slug: "caption-interceptor",
    code: "BLD-04",
    title: "CAPTION INTERCEPTOR",
    subject: "LIVE BROADCAST TYPOGRAPHY",
    concept:
      "A subtitle compositor for stream channels that translates spoken segments into coded lower-third blocks.",
    frameUse:
      "Applies SF text hierarchy aliases to preserve readability under latency, compression, and mobile viewport constraints.",
    signalUse:
      "Uses VHS noise and timed glyph interruptions only at speaker handoff moments to reinforce scene transitions.",
    status: "CONCEPT / MEDIA TOOL",
    toneClass: "border-accent/40 bg-accent/10",
    mission:
      "Make live captions functional and atmospheric without sacrificing understanding during high-noise broadcasts.",
    frameStack: [
      "Baseline-safe caption container with strict line limits.",
      "Speaker coding through deterministic badge rails.",
      "Mobile-first fallback with fixed contrast envelope.",
    ],
    signalStack: [
      "Handoff-triggered glyph fracture burst.",
      "Low-alpha VHS tape drift for scene transitions.",
      "Auto-damped motion when speech density rises.",
    ],
    interactionModel: [
      "Speech stream segmented to caption units.",
      "Frame layer composes readable blocks.",
      "Signal marks transition moments only.",
    ],
    output: "Broadcast subtitle skin for coded editorial streams.",
    registerLabel: "BROADCAST REGISTER",
    frameHeading: "FRAME LEGIBILITY STACK",
    signalHeading: "SIGNAL TRANSITION STACK",
    interactionHeading: "LIVE CAPTION FLOW",
    outputLabel: "CHANNEL OUTPUT",
    operatorNote:
      "Words land first, texture second. Save distortion for handoffs so meaning never drops out.",
  },
  {
    slug: "archive-heatwave",
    code: "BLD-05",
    title: "ARCHIVE HEATWAVE",
    subject: "CULTURAL MEMORY INDEX",
    concept:
      "A browsing layer for old flyers, mixes, and release notes that surfaces hidden relationships by scene, era, and city.",
    frameUse:
      "Structures every record through SF cards + breadcrumbs so deep archive paths remain navigable at high density.",
    signalUse:
      "Builds a faint glitch halo around clusters with high cross-reference weight, hinting at lineage without UI clutter.",
    status: "CONCEPT / ARCHIVE VIEWER",
    toneClass: "border-secondary/40 bg-secondary/20",
    mission:
      "Expose historical connections across fragmented cultural artifacts without turning the archive into visual noise.",
    frameStack: [
      "Deterministic archive cards with canonical metadata rails.",
      "Strict breadcrumb taxonomy for era/city/scene traversal.",
      "Fixed-width synopsis zones to stabilize scanning.",
    ],
    signalStack: [
      "Lineage halo around dense cross-reference nodes.",
      "Glitch flicker for rediscovered dormant links.",
      "Memory-wave overlays tuned below interaction threshold.",
    ],
    interactionModel: [
      "User traverses archive path in frame register.",
      "Signal layer suggests unseen adjacency.",
      "Operator pins findings into a research chain.",
    ],
    output: "Research-forward archive navigation surface.",
    registerLabel: "ARCHIVE REGISTER",
    frameHeading: "FRAME MEMORY STACK",
    signalHeading: "SIGNAL LINEAGE STACK",
    interactionHeading: "DISCOVERY FLOW",
    outputLabel: "RESEARCH SURFACE",
    operatorNote:
      "Treat each recovered fragment like a node, not an artifact. The value is in the chain, not the object.",
  },
  {
    slug: "night-shift-wayfinder",
    code: "BLD-06",
    title: "NIGHT SHIFT WAYFINDER",
    subject: "URBAN TRANSIT HUD",
    concept:
      "A route planner for late-night movement between venues, studios, and temporary workspaces under changing constraints.",
    frameUse:
      "Uses SF stepper logic to keep route decisions explicit: ENTRY, TRANSFER, HOLD, EXIT.",
    signalUse:
      "Animates only route deltas and risk states with pulse-speed modulation tied to disruption severity.",
    status: "CONCEPT / MOBILITY HUD",
    toneClass: "border-primary/40 bg-background",
    mission:
      "Keep navigation decisive during unstable nighttime conditions through structured routing and minimal expressive cues.",
    frameStack: [
      "Route stepper with deterministic decision checkpoints.",
      "Risk ledger panel with transparent scoring.",
      "Fallback map list for degraded connectivity mode.",
    ],
    signalStack: [
      "Pulse-speed escalation on risk-tier increase.",
      "Directional streaks only on route deltas.",
      "Subtle noise veil for uncertainty zones.",
    ],
    interactionModel: [
      "User selects destination + constraints.",
      "Frame computes route options.",
      "Signal emphasizes instability vectors.",
    ],
    output: "Late-night route intelligence module for creative operators.",
    registerLabel: "TRANSIT REGISTER",
    frameHeading: "FRAME NAV STACK",
    signalHeading: "SIGNAL RISK STACK",
    interactionHeading: "ROUTE NEGOTIATION FLOW",
    outputLabel: "OPERATOR OUTPUT",
    operatorNote:
      "Favor certainty over speed after midnight. A stable route beats a clever one in volatile windows.",
  },
];

export function getBuildBySlug(slug: string) {
  return BUILDS.find((build) => build.slug === slug);
}
