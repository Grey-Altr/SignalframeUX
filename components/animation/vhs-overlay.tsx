"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-plugins";

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
      // Bright scanline — travels down viewport
      if (scanRef.current) {
        gsap.to(scanRef.current, {
          y: "100vh",
          duration: 14,
          ease: "none",
          repeat: -1,
        });
      }

      // Slow scanline — 6x slower, subtler
      if (scanSlowRef.current) {
        gsap.to(scanSlowRef.current, {
          y: "100vh",
          duration: 84,
          ease: "none",
          repeat: -1,
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

    return () => ctx.revert();
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

      <style jsx>{`
        .vhs-overlay {
          position: fixed;
          inset: 0;
          z-index: 900;
          pointer-events: none;
          mix-blend-mode: normal;
        }

        /* ── CRT Scanlines ── */
        .vhs-crt {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(0, 0, 0, 0.03) 3px,
            rgba(0, 0, 0, 0.03) 4px
          );
          opacity: var(--vhs-crt-opacity, 0.6);
        }

        /* ── Bright Scanline with distortion zone ── */
        .vhs-scanline {
          position: absolute;
          top: -30px;
          left: 0;
          width: 100%;
          height: 60px;
          pointer-events: none;
        }
        /* The visible line */
        .vhs-scanline::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          transform: translateY(-50%);
          background: oklch(0.7 0.05 350 / 0.08);
          box-shadow:
            0 0 6px oklch(0.6 0.03 350 / 0.04),
            0 0 16px oklch(0.6 0.03 350 / 0.02);
        }
        /* Distortion zone — backdrop blur + slight warp */
        .vhs-scanline::after {
          content: '';
          position: absolute;
          inset: 0;
          backdrop-filter: blur(1.2px) contrast(1.15) saturate(1.35) brightness(1.06);
          -webkit-backdrop-filter: blur(1.2px) contrast(1.15) saturate(1.35) brightness(1.06);
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 30%,
            black 70%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 30%,
            black 70%,
            transparent 100%
          );
        }

        /* ── Slow Scanline override ── */
        .vhs-scanline--slow {
          height: 40px;
          top: -20px;
        }
        .vhs-scanline--slow::before {
          height: 1px;
          background: oklch(0.6 0.03 0 / 0.05);
          box-shadow: none;
        }
        .vhs-scanline--slow::after {
          backdrop-filter: blur(0.6px) contrast(1.06) saturate(1.1);
          -webkit-backdrop-filter: blur(0.6px) contrast(1.06) saturate(1.1);
        }

        /* ── Noise Grain ── */
        .vhs-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
          opacity: var(--vhs-noise-opacity, 0.03);
        }

        /* ── Static Burst (normally invisible) ── */
        .vhs-burst {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E");
          background-size: 128px;
          opacity: 0;
        }

        /* ── Glitch Slice ── */
        .vhs-glitch {
          position: absolute;
          inset: 0;
          background: inherit;
          opacity: 0;
          clip-path: none;
          mix-blend-mode: difference;
          background: linear-gradient(
            90deg,
            oklch(0.65 0.29 350 / 0.08) 0%,
            oklch(0.5 0.25 200 / 0.06) 50%,
            oklch(0.6 0.28 145 / 0.08) 100%
          );
        }

        /* ── Chromatic Aberration Edges ── */
        .vhs-aberration {
          position: absolute;
          left: 0;
          width: 100%;
          height: 140px;
          pointer-events: none;
        }
        .vhs-aberration--top {
          top: 0;
          background: linear-gradient(
            to bottom,
            oklch(0.65 0.12 350 / 0.12),
            oklch(0.5 0.10 200 / 0.08) 25%,
            oklch(0.6 0.10 145 / 0.05) 50%,
            oklch(0.55 0.06 80 / 0.02) 75%,
            transparent
          );
        }
        .vhs-aberration--bottom {
          bottom: 0;
          background: linear-gradient(
            to top,
            oklch(0.5 0.10 260 / 0.12),
            oklch(0.65 0.12 350 / 0.08) 25%,
            oklch(0.6 0.10 145 / 0.04) 50%,
            oklch(0.55 0.06 80 / 0.02) 75%,
            transparent
          );
        }

        /* ── Reduced motion & touch ── */
        @media (prefers-reduced-motion: reduce) {
          .vhs-overlay { display: none; }
        }
        @media (pointer: coarse) {
          .vhs-overlay { display: none; }
        }
      `}</style>
    </div>
  );
}
