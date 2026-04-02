"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-draw";

/**
 * CircuitDivider — PCB-style SVG trace that draws on scroll.
 *
 * Renders a horizontal circuit board trace with junction nodes,
 * perpendicular branches, and right-angle paths. DrawSVG reveals
 * the paths as the divider scrolls into view.
 *
 * Variants control visual weight and complexity:
 * - "default" — single horizontal trace with 2-3 branches
 * - "complex" — multiple parallel traces with more nodes
 * - "minimal" — thin single line with one node
 */

interface CircuitDividerProps {
  variant?: "default" | "complex" | "minimal";
  className?: string;
}

export function CircuitDivider({
  variant = "default",
  className = "",
}: CircuitDividerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll<SVGPathElement>(".circuit-path");
    const dots = svg.querySelectorAll<SVGCircleElement>(".circuit-dot");

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(paths, { drawSVG: "0%" });
      gsap.set(dots, { scale: 0, transformOrigin: "center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svg,
          start: "top 80%",
          once: true,
        },
      });

      // Draw main trace first
      const mainPaths = svg.querySelectorAll<SVGPathElement>(".circuit-path--main");
      const branchPaths = svg.querySelectorAll<SVGPathElement>(".circuit-path--branch");

      tl.to(mainPaths, {
        drawSVG: "100%",
        duration: 3,
        ease: "power1.inOut",
        stagger: 0.4,
      });

      // Draw branches slightly after
      if (branchPaths.length) {
        tl.to(
          branchPaths,
          {
            drawSVG: "100%",
            duration: 1.2,
            ease: "power1.inOut",
            stagger: 0.3,
          },
          "-=1.5"
        );
      }

      // Pop in junction dots
      tl.to(
        dots,
        {
          scale: 1,
          duration: 0.35,
          ease: "back.out(3)",
          stagger: 0.12,
        },
        "-=0.8"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div aria-hidden="true" className={`circuit-divider relative w-full opacity-[0.06] ${className}`}>
      {variant === "default" && <DefaultCircuit ref={svgRef} />}
      {variant === "complex" && <ComplexCircuit ref={svgRef} />}
      {variant === "minimal" && <MinimalCircuit ref={svgRef} />}
    </div>
  );
}

/* ── SVG Variants ── */

import { forwardRef } from "react";

const STROKE = "var(--color-foreground)";
const ACCENT = "var(--color-primary)";

const DefaultCircuit = forwardRef<SVGSVGElement>(function DefaultCircuit(_, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 48"
      fill="none"
      className="w-full h-6"
      preserveAspectRatio="none"
    >
      {/* Main trace */}
      <path
        className="circuit-path circuit-path--main"
        d="M0 24 H300 Q310 24 316 18 L340 6 Q346 0 356 0 H500 Q510 0 516 6 L540 18 Q546 24 556 24 H1200"
        stroke={STROKE}
        strokeWidth="2"
        fill="none"
      />
      {/* Parallel — offset +6px below main */}
      <path
        className="circuit-path circuit-path--main"
        d="M0 30 H295 Q305 30 311 24 L335 12 Q341 6 351 6 H505 Q515 6 521 12 L545 24 Q551 30 561 30 H1200"
        stroke={STROKE}
        strokeWidth="0.75"
        fill="none"
      />
      {/* Split branch — diagonal up */}
      <path
        className="circuit-path circuit-path--branch"
        d="M300 24 Q308 24 314 18 L360 6 Q366 2 376 2 H480"
        stroke={ACCENT}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Split branch — diagonal down right */}
      <path
        className="circuit-path circuit-path--branch"
        d="M750 24 Q758 24 764 30 L790 40 Q796 44 806 44 H920"
        stroke={STROKE}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Split branch — short diagonal up right */}
      <path
        className="circuit-path circuit-path--branch"
        d="M750 24 Q758 24 764 18 L785 8 Q790 4 800 4 H870"
        stroke={ACCENT}
        strokeWidth="1"
        fill="none"
      />
      {/* Parallel to down-right branch */}
      <path
        className="circuit-path circuit-path--branch"
        d="M755 28 Q763 28 769 34 L795 44 Q801 48 811 48 H910"
        stroke={STROKE}
        strokeWidth="0.5"
        fill="none"
      />
      {/* Junction nodes */}
      <circle className="circuit-dot" cx="300" cy="24" r="3" fill={STROKE} />
      <circle className="circuit-dot" cx="480" cy="2" r="2.5" fill={ACCENT} />
      <circle className="circuit-dot" cx="556" cy="24" r="2.5" fill={STROKE} />
      <circle className="circuit-dot" cx="750" cy="24" r="3" fill={STROKE} />
      <circle className="circuit-dot" cx="870" cy="4" r="2" fill={ACCENT} />
      <circle className="circuit-dot" cx="920" cy="44" r="2" fill={STROKE} />
    </svg>
  );
});

const ComplexCircuit = forwardRef<SVGSVGElement>(function ComplexCircuit(_, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 64"
      fill="none"
      className="w-full h-8"
      preserveAspectRatio="none"
    >
      {/* Upper main trace */}
      <path
        className="circuit-path circuit-path--main"
        d="M0 20 H180 Q190 20 196 14 L220 4 Q226 0 236 0 H440 Q450 0 456 6 L470 14 Q476 20 486 20 H700 Q710 20 716 14 L740 4 Q746 0 756 0 H1200"
        stroke={STROKE}
        strokeWidth="2"
        fill="none"
      />
      {/* Upper parallel — offset +5px */}
      <path
        className="circuit-path circuit-path--main"
        d="M0 25 H176 Q186 25 192 19 L216 9 Q222 5 232 5 H444 Q454 5 460 11 L474 19 Q480 25 490 25 H696 Q706 25 712 19 L736 9 Q742 5 752 5 H1200"
        stroke={STROKE}
        strokeWidth="0.5"
        fill="none"
      />
      {/* Lower main trace */}
      <path
        className="circuit-path circuit-path--main"
        d="M0 48 H120 Q130 48 136 42 L160 30 Q166 26 176 26 H350 Q360 26 366 32 L390 42 Q396 48 406 48 H650 Q660 48 666 42 L700 26 Q706 22 716 22 H900 Q910 22 916 28 L940 42 Q946 48 956 48 H1200"
        stroke={STROKE}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Lower parallel — offset -5px */}
      <path
        className="circuit-path circuit-path--main"
        d="M0 43 H116 Q126 43 132 37 L156 25 Q162 21 172 21 H354 Q364 21 370 27 L394 37 Q400 43 410 43 H646 Q656 43 662 37 L696 21 Q702 17 712 17 H904 Q914 17 920 23 L944 37 Q950 43 960 43 H1200"
        stroke={STROKE}
        strokeWidth="0.5"
        fill="none"
      />
      {/* Diagonal connector — upper to lower */}
      <path
        className="circuit-path circuit-path--branch"
        d="M486 20 Q492 20 498 26 L530 44 Q536 48 546 48 H650"
        stroke={ACCENT}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Diagonal connector — lower to upper */}
      <path
        className="circuit-path circuit-path--branch"
        d="M716 22 Q722 22 728 16 L750 4 Q754 0 756 0"
        stroke={ACCENT}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Split from upper — diagonal down-right */}
      <path
        className="circuit-path circuit-path--branch"
        d="M236 0 Q244 0 250 6 L280 30 Q286 36 296 36 H380"
        stroke={STROKE}
        strokeWidth="1"
        fill="none"
      />
      {/* Split from lower — diagonal down */}
      <path
        className="circuit-path circuit-path--branch"
        d="M406 48 Q414 48 420 54 L440 62 Q444 64 454 64 H560"
        stroke={STROKE}
        strokeWidth="1"
        fill="none"
      />
      {/* Split from upper right — diagonal up */}
      <path
        className="circuit-path circuit-path--branch"
        d="M956 48 Q964 48 970 42 L1000 22 Q1006 18 1016 18 H1100"
        stroke={ACCENT}
        strokeWidth="1"
        fill="none"
      />
      {/* Short diagonal spur */}
      <path
        className="circuit-path circuit-path--branch"
        d="M176 26 Q182 26 186 22 L200 12 Q204 8 214 8 H260"
        stroke={ACCENT}
        strokeWidth="1"
        fill="none"
      />
      {/* Junction nodes */}
      <circle className="circuit-dot" cx="180" cy="20" r="3" fill={STROKE} />
      <circle className="circuit-dot" cx="236" cy="0" r="2.5" fill={ACCENT} />
      <circle className="circuit-dot" cx="486" cy="20" r="3" fill={STROKE} />
      <circle className="circuit-dot" cx="380" cy="36" r="2" fill={STROKE} />
      <circle className="circuit-dot" cx="756" cy="0" r="2.5" fill={ACCENT} />
      <circle className="circuit-dot" cx="176" cy="26" r="2.5" fill={STROKE} />
      <circle className="circuit-dot" cx="260" cy="8" r="2" fill={ACCENT} />
      <circle className="circuit-dot" cx="406" cy="48" r="2.5" fill={STROKE} />
      <circle className="circuit-dot" cx="560" cy="64" r="2" fill={STROKE} />
      <circle className="circuit-dot" cx="716" cy="22" r="3" fill={ACCENT} />
      <circle className="circuit-dot" cx="956" cy="48" r="2.5" fill={STROKE} />
      <circle className="circuit-dot" cx="1100" cy="18" r="2" fill={ACCENT} />
    </svg>
  );
});

const MinimalCircuit = forwardRef<SVGSVGElement>(function MinimalCircuit(_, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 32"
      fill="none"
      className="w-full h-4"
      preserveAspectRatio="none"
    >
      {/* Single trace with diagonal kink */}
      <path
        className="circuit-path circuit-path--main"
        d="M0 16 H500 Q510 16 516 10 L540 4 Q546 0 556 0 H644 Q654 0 660 4 L684 10 Q690 16 700 16 H1200"
        stroke={STROKE}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Parallel — offset +5px below */}
      <path
        className="circuit-path circuit-path--main"
        d="M0 21 H496 Q506 21 512 15 L536 9 Q542 5 552 5 H648 Q658 5 664 9 L688 15 Q694 21 704 21 H1200"
        stroke={STROKE}
        strokeWidth="0.5"
        fill="none"
      />
      {/* Split — short diagonal spur */}
      <path
        className="circuit-path circuit-path--branch"
        d="M700 16 Q708 16 714 22 L730 30 Q734 32 744 32 H830"
        stroke={ACCENT}
        strokeWidth="1"
        fill="none"
      />
      {/* Nodes */}
      <circle className="circuit-dot" cx="600" cy="0" r="2.5" fill={ACCENT} />
      <circle className="circuit-dot" cx="700" cy="16" r="2" fill={STROKE} />
      <circle className="circuit-dot" cx="830" cy="32" r="2" fill={ACCENT} />
    </svg>
  );
});
