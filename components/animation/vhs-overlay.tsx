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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ctx = gsap.context(() => {
      // Bright scanline — travels down viewport (delayed 10s on load)
      if (scanRef.current) {
        gsap.to(scanRef.current, {
          y: "100vh",
          duration: 14,
          ease: "none",
          repeat: -1,
          delay: 10,
        });
      }

      // Slow scanline — 6x slower, subtler (delayed 10s on load)
      if (scanSlowRef.current) {
        gsap.to(scanSlowRef.current, {
          y: "100vh",
          duration: 84,
          ease: "none",
          repeat: -1,
          delay: 10,
        });
      }

      // Noise flicker — subtle opacity variation
      if (noiseRef.current) {
        gsap.to(noiseRef.current, {
          opacity: "random(0.03, 0.07)",
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.3,
          ease: "none",
        });
      }

      // Static burst — rare flash of heavier noise (every 8-15s)
      if (burstRef.current) {
        function scheduleBurst() {
          const delay = gsap.utils.random(12, 25);
          gsap.delayedCall(delay, () => {
            if (!burstRef.current) return;
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
          const delay = gsap.utils.random(25, 50);
          gsap.delayedCall(delay, () => {
            if (!glitchRef.current) return;
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

    // Pause all VHS animations when tab is hidden to save CPU/GPU
    const onVisibilityChange = () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
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

    </div>
  );
}
