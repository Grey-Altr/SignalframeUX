"use client";

import { useEffect, useRef, useState } from "react";

interface SectionInfo {
  id: string;
  label: string;
}

/**
 * InstrumentHUD -- Wipeout-cockpit live instrument readout.
 *
 * Fixed top-right overlay. Five data fields on desktop, three on mobile.
 * Non-interactive (complementary readout, not navigation). No background,
 * no chrome, no pill. Mounted once in app/layout.tsx -- renders on every route.
 *
 * Per-frame fields (scroll %, SIG intensity) use DOM refs + rAF direct writes.
 * Do NOT use useState for those -- React re-renders at 60fps would tank the
 * frame budget (brief section VL-06 frame budget contract).
 *
 * Section tracking inherits the Phase 30 IntersectionObserver logic
 * (LIFTED from the retired SectionIndicator -- the hardest part of HUD
 * correctness is the section boundary detection under Lenis, and that
 * code was already debugged and tested in Phase 30).
 */
export function InstrumentHUD() {
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewport, setViewport] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const activeIndexRef = useRef(0); // Pitfall 2 guard -- avoids dep loop

  const scrollRef = useRef<HTMLSpanElement>(null);
  const sigRef = useRef<HTMLSpanElement>(null);

  // Discover sections on mount (same pattern as retired SectionIndicator)
  // Wave 3 T-04 fix: subpages have multiple [data-section] elements (SFSection wrappers +
  // the <main> element). When [data-section][data-primary] elements exist, use only those —
  // this gives subpages a single primary section with the correct route id/label so the HUD
  // shows [SYS//TOK] / [INIT//SYS] / [REF//API] rather than falling into index-branch [01//TOK].
  // Homepage has no [data-primary] elements, so falls back to all [data-section] for multi-section scroll.
  useEffect(() => {
    const primaryEls = document.querySelectorAll<HTMLElement>("[data-section][data-primary]");
    const queryEls = primaryEls.length > 0
      ? primaryEls
      : document.querySelectorAll<HTMLElement>("[data-section]");
    const items = Array.from(queryEls).map((el) => ({
      id: el.getAttribute("data-section") || el.id || "",
      label: el.getAttribute("data-section-label") || el.getAttribute("data-section") || "",
    }));
    setSections(items);
  }, []);

  // IntersectionObserver for active section (Pitfall 2: activeIndexRef, not activeIndex state in deps)
  useEffect(() => {
    if (sections.length === 0) return;
    const primaryEls = document.querySelectorAll<HTMLElement>("[data-section][data-primary]");
    const els = primaryEls.length > 0
      ? primaryEls
      : document.querySelectorAll<HTMLElement>("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 10) {
          activeIndexRef.current = 0;
          setActiveIndex(0);
          return;
        }
        let bestIndex = activeIndexRef.current;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            const idx = Array.from(els).indexOf(entry.target as HTMLElement);
            if (idx !== -1) {
              bestIndex = idx;
              bestRatio = entry.intersectionRatio;
            }
          }
        });
        if (bestRatio > 0) {
          activeIndexRef.current = bestIndex;
          setActiveIndex(bestIndex);
        }
      },
      { threshold: [0.1, 0.3, 0.5, 0.7] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Mobile detection via matchMedia (the HUD must render on mobile too -- no CSS display toggle)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Reduced motion detection (gates the rAF scroll % updater)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Viewport updates on resize (NOT per frame)
  useEffect(() => {
    const update = () => setViewport(`${window.innerWidth}\u00d7${window.innerHeight}`);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // Clock updates every second (NOT per frame)
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm}`);
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Per-frame fields -- DOM refs + rAF direct writes (NO setState in the loop)
  useEffect(() => {
    if (reducedMotion) {
      if (scrollRef.current) scrollRef.current.textContent = "\u2014%";
      if (sigRef.current) sigRef.current.textContent = "SIG:\u2014";
      return;
    }
    let rafId = 0;
    const loop = () => {
      if (scrollRef.current) {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
        scrollRef.current.textContent = `${pct}%`;
      }
      if (sigRef.current) {
        const raw = getComputedStyle(document.documentElement).getPropertyValue("--sfx-signal-intensity").trim();
        const n = parseFloat(raw);
        sigRef.current.textContent = Number.isFinite(n) ? `SIG:${n.toFixed(1)}` : "SIG:0.0";
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const sectionLabel =
    sections.length > 0
      ? `[${
          sections.length === 1 && sections[0].id
            ? sections[0].id.toUpperCase()
            : String(activeIndex + 1).padStart(2, "0")
        }//${sections[activeIndex].label.toUpperCase()}]`
      : "[00//\u2014]";

  return (
    <aside
      data-instrument-hud
      role="complementary"
      aria-label="System readout"
      className="fixed top-[80px] right-[24px] z-[var(--z-content)] flex flex-col items-end font-mono text-[var(--text-2xs)] uppercase tracking-[0.08em] text-muted-foreground pointer-events-none select-none leading-[1.6]"
    >
      <span data-hud-field="section" className="text-foreground">
        {sectionLabel}
      </span>
      {!isMobile && <span ref={scrollRef} data-hud-field="scroll">0%</span>}
      <span ref={sigRef} data-hud-field="sig">SIG:0.0</span>
      {!isMobile && <span data-hud-field="viewport">{viewport || "0\u00d70"}</span>}
      <span data-hud-field="time">{time || "00:00"}</span>
    </aside>
  );
}
