"use client";

/**
 * ProofSection — PROOF homepage section (Phase 32, Plan 01).
 *
 * Full-viewport interactive demonstration of SIGNAL/FRAME layer separation.
 * A single section-scoped --signal-intensity CSS custom property (set on THIS
 * element's inline style, never on :root) drives three concurrent layers:
 *
 *   Layer A (data-proof-layer="shader"): ProofShader WebGL — geometric lattice
 *     at low intensity, FBM noise at high intensity. Reads --signal-intensity
 *     via its own section-scoped MutationObserver.
 *
 *   Layer B (data-proof-layer="skeleton"): SkeletonGrid — 12 stroke-only SF
 *     component silhouettes. Opacity driven directly by rAF lerp (.style.opacity
 *     = 1 - currentIntensity). No GSAP tween on this property (pitfall 4).
 *
 *   Layer C (frame-pole column, data-proof-layer attr): JetBrains Mono left column
 *     with coded SF//[CAT]-NNN identifiers and system stats (51 components, 100KB
 *     bundle, 100/100 Lighthouse). Opacity is NOT driven — always visible.
 *
 * Input sources (all drive the same _targetIntensity):
 *   - Desktop: pointermove on section element (Pointer Events API, not touch-specific)
 *   - Touch/mobile: same pointermove handler fires on touch-drag (Pointer Events)
 *   - iOS tilt: DeviceOrientationEvent.gamma — clamped to ±60° (pitfall 6)
 *     Permission requested once on first touchstart (silent gate, no overlay)
 *
 * ScrollTrigger: onEnter/onLeave/onEnterBack/onLeaveBack callbacks ONLY.
 * No pin. No scrub. (AC-10)
 *
 * Reduced-motion: early return from effect — static side-by-side split with
 * both FRAME-pole column and skeleton layer visible without animation. (AC-6)
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 *
 * @module components/blocks/proof-section
 */

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-core";
import { cn } from "@/lib/utils";
import { ProofShader } from "@/components/animation/proof-shader";
import { SkeletonGrid } from "@/components/animation/component-skeleton";
import { PROOF_COMPONENT_SKELETONS } from "@/lib/proof-components";

// ── rAF lerp state (module-level — single ProofSection instance on page) ────
//
// AC-7: --signal-intensity is written to sectionRef.current ONLY.
// Scope isolation: no global :root property writes from this file.
// sectionRef.current.style.setProperty is the only setter used.

const LERP_FACTOR = 0.08;
let _targetIntensity = 0.8;
let _currentIntensity = 0.8;
let _rafId: number | null = null;

function startLerpLoop(
  sectionEl: HTMLElement,
  skeletonEl: HTMLElement | null,
): void {
  if (_rafId !== null) return;
  const tick = () => {
    _currentIntensity +=
      (_targetIntensity - _currentIntensity) * LERP_FACTOR;
    // AC-7: write to section element inline style — never to :root
    sectionEl.style.setProperty(
      "--signal-intensity",
      _currentIntensity.toFixed(4),
    );
    // AC-9: skeleton opacity driven directly in same rAF tick — no GSAP tween
    if (skeletonEl) {
      skeletonEl.style.opacity = (1 - _currentIntensity).toFixed(4);
    }
    _rafId = requestAnimationFrame(tick);
  };
  _rafId = requestAnimationFrame(tick);
}

function stopLerpLoop(): void {
  if (_rafId !== null) {
    cancelAnimationFrame(_rafId);
    _rafId = null;
  }
}

// ── Gyroscope permission gate (iOS 13+) ─────────────────────────────────────
//
// AC-11: Called once on first touchstart (one-shot via { once: true }).
// Silent — no instruction overlay rendered regardless of outcome.

async function requestGyroPermission(): Promise<boolean> {
  if (typeof DeviceOrientationEvent === "undefined") return false;
  const DOE = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>;
  };
  if (typeof DOE.requestPermission === "function") {
    try {
      const result = await DOE.requestPermission();
      return result === "granted";
    } catch {
      return false;
    }
  }
  // Android / non-iOS: no permission required, events fire immediately
  return true;
}

// AC-12: Clamp gamma to -60..+60 to avoid ±90 discontinuity snap (pitfall 6)
function clampGamma(gamma: number | null): number {
  if (gamma === null) return 0.5;
  const clamped = Math.max(-60, Math.min(60, gamma));
  return (clamped + 60) / 120;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const skeletonRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // AC-6: Reduced-motion early return — render static split, no animation
      // prefers-reduced-motion guard: no rAF loop, no pointermove, no ScrollTrigger
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        section.style.setProperty("--signal-intensity", "0.5");
        if (skeletonRef.current) {
          skeletonRef.current.style.opacity = "0.5";
        }
        return;
      }

      // Default state — high intensity (SIGNAL dominant)
      _targetIntensity = 0.8;
      _currentIntensity = 0.8;
      section.style.setProperty("--signal-intensity", "0.8");

      // ── Pointer handler — desktop + touch via Pointer Events API ──────────
      // PR-05: pointermove fires for both mouse and touch-drag (Pointer Events API)
      const handlePointerMove = (e: PointerEvent) => {
        _targetIntensity = Math.max(
          0,
          Math.min(1, e.clientX / window.innerWidth),
        );
      };
      const handlePointerLeave = () => {
        // Behavior 5: on pointerleave, drift back to SIGNAL default (1.0)
        _targetIntensity = 1.0;
      };

      // ── Gyroscope handler (attached after iOS permission grant) ───────────
      let gyroAttached = false;
      const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
        // AC-12: clampGamma maps ±60° to 0..1 range
        _targetIntensity = clampGamma(e.gamma);
      };
      const attachGyro = () => {
        if (gyroAttached) return;
        gyroAttached = true;
        window.addEventListener("deviceorientation", handleDeviceOrientation, {
          passive: true,
        });
      };

      // ── First-touch permission gate (one-shot, silent) ────────────────────
      // AC-11: { once: true } ensures this fires exactly once
      // No instruction overlay rendered regardless of grant/deny outcome
      let gyroPermissionRequested = false;
      const onFirstTouch = async () => {
        if (gyroPermissionRequested) return;
        gyroPermissionRequested = true;
        const granted = await requestGyroPermission();
        if (granted) attachGyro();
      };

      section.addEventListener("touchstart", onFirstTouch, {
        once: true,
        passive: true,
      });

      const activatePointerListener = () => {
        section.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        section.addEventListener("pointerleave", handlePointerLeave, {
          passive: true,
        });
      };
      const deactivatePointerListener = () => {
        section.removeEventListener("pointermove", handlePointerMove);
        section.removeEventListener("pointerleave", handlePointerLeave);
      };

      // ── ScrollTrigger lifecycle — AC-10: NO pin, NO scrub ─────────────────
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        invalidateOnRefresh: true,
        onEnter: () => {
          activatePointerListener();
          startLerpLoop(section, skeletonRef.current);
        },
        onLeave: () => {
          deactivatePointerListener();
          stopLerpLoop();
          // Restore default SIGNAL state on leave
          section.style.setProperty("--signal-intensity", "1.0");
          if (skeletonRef.current) skeletonRef.current.style.opacity = "0";
        },
        onEnterBack: () => {
          activatePointerListener();
          startLerpLoop(section, skeletonRef.current);
        },
        onLeaveBack: () => {
          deactivatePointerListener();
          stopLerpLoop();
          section.style.setProperty("--signal-intensity", "1.0");
          if (skeletonRef.current) skeletonRef.current.style.opacity = "0";
        },
      });

      // Zero-range trap diagnostic (RESEARCH pitfall 1 adaptation)
      console.debug(
        "[PROOF ST] start:",
        trigger.start,
        "end:",
        trigger.end,
      );

      return () => {
        deactivatePointerListener();
        stopLerpLoop();
        if (gyroAttached) {
          window.removeEventListener(
            "deviceorientation",
            handleDeviceOrientation,
          );
        }
        section.removeEventListener("touchstart", onFirstTouch);
        trigger.kill();
      };
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      data-proof-root
      data-anim
      style={{ height: "100vh", position: "relative", overflow: "hidden" }}
      className="rounded-none"
    >
      {/* Layer A — ProofShader WebGL (absolute inset-0, z-0)
          sectionRef passed so the shader's MutationObserver is section-scoped */}
      <ProofShader
        sectionRef={sectionRef as React.RefObject<HTMLElement | null>}
      />

      {/* Layer B — SkeletonGrid (absolute inset-0, z-10)
          skeletonRef used by rAF lerp to drive .style.opacity directly */}
      <SkeletonGrid ref={skeletonRef} />

      {/* Layer C — FRAME-pole left column (absolute left, z-20)
          column width is a layout dimension, not a spacing stop;
          all padding/gap values below are blessed stops */}
      <div
        data-proof-layer="frame-pole"
        className={cn(
          "absolute left-0 top-0 bottom-0 z-20",
          "p-8 flex flex-col gap-6",
          "font-mono text-sm text-foreground rounded-none",
          "bg-background/0",
        )}
        style={{ width: "320px" }}
      >
        {/* System stats — AC-4: 51, 100KB, 100/100 must be present */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest opacity-60">
            SYSTEM READOUT
          </span>
          <span>COMPONENTS // 51</span>
          <span>BUNDLE // 100KB</span>
          <span>LIGHTHOUSE // 100/100</span>
        </div>

        {/* INVENTORY PREVIEW — first 6 SF//[CAT]-NNN identifiers */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest opacity-60">
            INVENTORY PREVIEW
          </span>
          {PROOF_COMPONENT_SKELETONS.slice(0, 6).map((id) => (
            <span key={id}>{id}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
