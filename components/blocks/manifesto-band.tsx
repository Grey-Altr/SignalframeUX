"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ── Link style constant (kept DRY) ── */
const LINK_CLASS =
  "text-primary no-underline relative inline-block py-0.5 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100";

/* ── Manifesto content definition ── */
type Segment =
  | { type: "word"; text: string }
  | { type: "sup"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "space" };

const SEGMENTS: Segment[] = [
  // "SignalframeUX™ is not a component library. It is a programmable surface."
  { type: "word", text: "SignalframeUX" },
  { type: "sup", text: "™" },
  { type: "space" },
  { type: "word", text: "is" },
  { type: "space" },
  { type: "word", text: "not" },
  { type: "space" },
  { type: "word", text: "a" },
  { type: "space" },
  { type: "word", text: "component" },
  { type: "space" },
  { type: "word", text: "library." },
  { type: "space" },
  { type: "word", text: "It" },
  { type: "space" },
  { type: "word", text: "is" },
  { type: "space" },
  { type: "word", text: "a" },
  { type: "space" },
  { type: "link", text: "programmable surface", href: "/init" },
  { type: "word", text: "." },
  { type: "space" },
  // "Build. Ship. Signal. Repeat.™"
  { type: "word", text: "Build." },
  { type: "space" },
  { type: "word", text: "Ship." },
  { type: "space" },
  { type: "word", text: "Signal." },
  { type: "space" },
  { type: "word", text: "Repeat." },
  { type: "sup", text: "™" },
  { type: "space" },
  // "Made in SignalframeUX, north of nowhere."
  { type: "word", text: "Made" },
  { type: "space" },
  { type: "word", text: "in" },
  { type: "space" },
  { type: "word", text: "SignalframeUX," },
  { type: "space" },
  { type: "word", text: "north" },
  { type: "space" },
  { type: "word", text: "of" },
  { type: "space" },
  { type: "word", text: "nowhere." },
  { type: "space" },
  // Links row
  { type: "link", text: "340+ components", href: "/inventory" },
  { type: "space" },
  { type: "word", text: "·" },
  { type: "space" },
  { type: "link", text: "OKLCH tokens", href: "/system" },
  { type: "space" },
  { type: "word", text: "·" },
  { type: "space" },
  { type: "link", text: "API-first", href: "/reference" },
  { type: "space" },
  { type: "word", text: "·" },
  { type: "space" },
  { type: "link", text: "React + TypeScript", href: "/init" },
  { type: "word", text: "." },
];

// Collect only the word-type indices (not links, not spaces) — static, derived from SEGMENTS
const wordIndices: number[] = SEGMENTS.reduce<number[]>((acc, seg, i) => {
  if (seg.type === "word" || seg.type === "sup") acc.push(i);
  return acc;
}, []);

export function ManifestoBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // Progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
    const sectionHeight = rect.height;
    const totalTravel = vh + sectionHeight;
    const traveled = vh - rect.top;
    const progress = Math.max(0, Math.min(1, traveled / totalTravel));

    // Map progress to word reveal — words reveal across the middle 60% of scroll
    const revealStart = 0.15;
    const revealEnd = 0.85;
    const revealProgress = Math.max(
      0,
      Math.min(1, (progress - revealStart) / (revealEnd - revealStart))
    );

    const totalWords = wordIndices.length;
    const currentWordFloat = revealProgress * totalWords;

    wordIndices.forEach((segIndex, wordOrder) => {
      const el = wordRefs.current[segIndex];
      if (!el) return;

      if (wordOrder < currentWordFloat - 1) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      } else if (wordOrder < currentWordFloat) {
        // Partial fade + lift for the "current" word
        const partial = currentWordFloat - wordOrder;
        el.style.opacity = String(0.35 + 0.65 * partial);
        el.style.transform = `translateY(${(1 - partial) * 3}px)`;
      } else {
        el.style.opacity = "0.35";
        el.style.transform = "translateY(3px)";
      }
    });
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced motion — reveal all words immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wordIndices.forEach((segIndex) => {
        const el = wordRefs.current[segIndex];
        if (el) el.style.opacity = "1";
      });
      return;
    }

    // Initial pass
    handleScroll();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleScroll, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", debouncedResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      data-anim="yellow-band"

      className="sf-yellow-band sf-grain border-b-4 border-foreground py-6 px-[clamp(20px,4vw,48px)] relative overflow-hidden"
    >
      <p className="text-[clamp(14px,2vw,22px)] leading-[1.5] font-bold text-foreground relative z-[var(--z-content)]">
        {SEGMENTS.map((seg, i) => {
          if (seg.type === "space") {
            return " ";
          }

          if (seg.type === "link") {
            // Links always full opacity
            return (
              <Link key={i} href={seg.href} className={LINK_CLASS}>
                {seg.text}
              </Link>
            );
          }

          if (seg.type === "sup") {
            return (
              <sup
                key={i}
                ref={(el) => { wordRefs.current[i] = el; }}
                data-anim="manifesto-word"
                className="text-[var(--text-sm)]"
                style={{ opacity: 0, transform: "translateY(3px)", display: "inline-block" }}
              >
                {seg.text}
              </sup>
            );
          }

          // Regular word
          return (
            <span
              key={i}
              ref={(el) => { wordRefs.current[i] = el; }}
              data-anim="manifesto-word"
              style={{ opacity: 0, transform: "translateY(3px)", display: "inline-block" }}
            >
              {seg.text}
            </span>
          );
        })}
      </p>
    </section>
  );
}
