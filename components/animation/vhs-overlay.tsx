"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-core";

/**
 * VHS Overlay — ambient CRT texture with a touch of analog decay.
 *
 * Layers:
 * 1. CRT scanlines — repeating 2px horizontal lines (pure CSS)
 * 2. Bright scanline — single traveling magenta line with glow (GSAP)
 * 3. Noise flicker — grain opacity pulses (GSAP)
 * 4. Color bleed — subtle chromatic aberration at viewport edges (CSS)
 * 5. Static burst — brief random noise intensification (GSAP, rare)
 * 6. Chromatic aberration — RGB channel offset (1-2px, intensity > 0.3)
 * 7. Horizontal jitter — stepped translateX noise (tape-dropout feel)
 * 8. Dropout bands — random horizontal black bars (idle phase 2+)
 * 9. Frame-edge vignette — radial-gradient perimeter darkening
 *
 * All layers respect prefers-reduced-motion via GSAP global freeze.
 * Controlled by CSS custom properties for runtime tuning.
 */
export function VHSOverlay() {
  const noiseRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const scanSlowRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const dropoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Scoped timeline for pause/resume — only VHS animations, not global
    const vhsTl = gsap.timeline();
    let killed = false;

    const ctx = gsap.context(() => {
      // Bright scanline — travels down viewport (delayed 10s on load)
      if (scanRef.current) {
        vhsTl.to(scanRef.current, {
          y: "100vh",
          duration: 28,
          ease: "none",
          repeat: -1,
          delay: 10,
        }, 0);
      }

      // Slow scanline — 6x slower, subtler (delayed 10s on load)
      if (scanSlowRef.current) {
        vhsTl.to(scanSlowRef.current, {
          y: "100vh",
          duration: 84,
          ease: "none",
          repeat: -1,
          delay: 10,
        }, 0);
      }

      // Noise flicker — opacity pulses around the intensity-derived base
      if (noiseRef.current) {
        // Read the derived noise opacity (set by SignalIntensityBridge)
        const baseNoise = parseFloat(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--sfx-vhs-noise-opacity")
        ) || 0.025;
        const lo = Math.max(0, baseNoise - 0.01);
        const hi = baseNoise + 0.02;

        vhsTl.to(noiseRef.current, {
          opacity: `random(${lo}, ${hi})`,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.3,
          ease: "none",
        }, 0);
      }

      // Static burst — rare flash of heavier noise (every 12-15s)
      if (burstRef.current) {
        function scheduleBurst() {
          if (killed) return;
          const delay = gsap.utils.random(12, 25);
          gsap.delayedCall(delay, () => {
            if (killed || !burstRef.current) return;
            gsap.to(burstRef.current, {
              opacity: gsap.utils.random(0.015, 0.035),
              duration: 0.2,
              yoyo: true,
              repeat: gsap.utils.random(1, 2, 1),
              ease: "none",
              onComplete: () => {
                if (burstRef.current) burstRef.current.style.opacity = "0";
                scheduleBurst();
              },
            });
          });
        }
        scheduleBurst();
      }

      // Glitch — aggressive horizontal slice displacement (every 12-25s)
      if (glitchRef.current) {
        function scheduleGlitch() {
          if (killed) return;
          const delay = gsap.utils.random(25, 50);
          gsap.delayedCall(delay, () => {
            if (killed || !glitchRef.current) return;
            const el = glitchRef.current;

            // Fire a rapid burst of 3-6 slice displacements
            const burstCount = gsap.utils.random(3, 6, 1);
            const tl = gsap.timeline({
              onComplete: () => {
                el.style.clipPath = "none";
                el.style.opacity = "0";
                scheduleGlitch();
              },
            });

            for (let i = 0; i < burstCount; i++) {
              const bandTop = gsap.utils.random(5, 80);
              const bandHeight = gsap.utils.random(3, 15);
              const shiftX = gsap.utils.random(-20, 20);
              const skew = gsap.utils.random(-3, 3);

              tl.call(() => {
                el.style.clipPath = `inset(${bandTop}% 0 ${100 - bandTop - bandHeight}% 0)`;
              })
                .set(el, { opacity: 1, x: shiftX, skewX: skew })
                .to(el, {
                  opacity: 0,
                  x: 0,
                  skewX: 0,
                  duration: gsap.utils.random(0.04, 0.1),
                  ease: "none",
                });
            }
          });
        }
        scheduleGlitch();
      }

    });

    // VHS-01: Chromatic aberration — update opacity from intensity
    // Scanline opacity = 0.005 + intensity * 0.015
    // At intensity 0.3 → scanline opacity ~0.0095
    // Chromatic only visible above 0.3 intensity
    function updateChromaticOpacity() {
      const scanlineOp = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--sfx-vhs-scanline-opacity")
      ) || 0.005;
      // Derive intensity from scanline opacity: i = (scanlineOp - 0.005) / 0.015
      const intensity = Math.max(0, (scanlineOp - 0.005) / 0.015);
      // Only visible above 0.3 intensity, then scale 0→1 over 0.3→1.0 range
      const chromaticOpacity = intensity > 0.3
        ? ((intensity - 0.3) / 0.7)
        : 0;
      document.documentElement.style.setProperty(
        "--sfx-vhs-chromatic-opacity",
        String(Math.round(chromaticOpacity * 1000) / 1000),
      );
    }

    // Observe style attribute mutations on <html> to track intensity changes
    const chromaticObserver = new MutationObserver(() => {
      updateChromaticOpacity();
    });
    chromaticObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    updateChromaticOpacity();

    // Pause only VHS animations when tab is hidden to save CPU/GPU
    const onVisibilityChange = () => {
      if (document.hidden) {
        vhsTl.pause();
      } else {
        vhsTl.resume();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      killed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      chromaticObserver.disconnect();
      vhsTl.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div
      className="vhs-overlay"
      aria-hidden="true"
    >
      {/* Layer 1: CRT scanlines — repeating horizontal lines */}
      <div className="vhs-crt" />

      {/* Layer 2: Bright traveling scanline with distortion */}
      <div ref={scanRef} className="vhs-scanline" />

      {/* Layer 2b: Slow scanline — barely-there drift */}
      <div ref={scanSlowRef} className="vhs-scanline vhs-scanline--slow" />

      {/* Layer 3: Persistent noise grain */}
      <div ref={noiseRef} className="vhs-noise" />

      {/* Layer 4: Static burst overlay (normally invisible) */}
      <div ref={burstRef} className="vhs-burst" />

      {/* Layer 5: Glitch — horizontal slice displacement */}
      <div ref={glitchRef} className="vhs-glitch" />

      {/* Layer 6: Chromatic aberration edges */}
      <div className="vhs-aberration vhs-aberration--top" />
      <div className="vhs-aberration vhs-aberration--bottom" />

      {/* Layer 7: Chromatic aberration — RGB channel offset (VHS-01) */}
      <div className="vhs-chromatic vhs-chromatic--red" />
      <div className="vhs-chromatic vhs-chromatic--cyan" />

      {/* Layer 8: Horizontal jitter — stepped noise (VHS-02) */}
      <div className="vhs-jitter">
        <div className="vhs-crt" />
      </div>

      {/* Layer 9: Dropout bands — idle phase 2+ (VHS-03) */}
      <div ref={dropoutRef} className="vhs-dropout" data-vhs-dropout />

      {/* Layer 10: Frame-edge vignette (VHS-04) */}
      <div className="vhs-vignette" />

    </div>
  );
}
