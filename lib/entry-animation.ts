// SignalframeUX Animation — GSAP-dependent components and utilities
// Requires: gsap, @gsap/react as peerDependencies

// ── GSAP-dependent SF Components ─────────────────────────────────────────────
export {
  SFAccordion,
  SFAccordionItem,
  SFAccordionTrigger,
  SFAccordionContent,
} from "../components/sf/sf-accordion";
export { SFProgress } from "../components/sf/sf-progress";
export { SFStatusDot, type SFStatusDotStatus } from "../components/sf/sf-status-dot";
export { SFToaster, sfToast } from "../components/sf/sf-toast";
// SFStepper: imports SFProgress → gsap-core → gsap (transitive)
export { SFStepper, SFStep } from "../components/sf/sf-stepper";
// SFEmptyState: uses ScrambleText → gsap-split → gsap (transitive)
export { SFEmptyState } from "../components/sf/sf-empty-state";

// ── GSAP Hooks ────────────────────────────────────────────────────────────────
// use-nav-reveal depends on @/lib/gsap-core (ScrollTrigger)
export { useNavReveal } from "../hooks/use-nav-reveal";

// ── GSAP Utilities ────────────────────────────────────────────────────────────
export * from "./gsap-core";
export * from "./gsap-easings";
export * from "./gsap-plugins";
export * from "./gsap-draw";
export * from "./gsap-flip";
export * from "./gsap-split";
