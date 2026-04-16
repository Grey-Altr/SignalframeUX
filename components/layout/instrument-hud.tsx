"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

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

  const [pos, setPos] = useState({ top: 80, right: 24 });

  // Align HUD with the end of the "X" in SIGNALFRAME//UX and make it equidistant from the top.
  // Content geometry (hero right edge, frameRight) must use --sf-content-scale (width-only),
  // while HUD's own transform uses --sf-canvas-scale (chrome, min-ratio). Using the chrome
  // scale for content alignment would misalign the HUD at any viewport where the two scales
  // diverge (e.g. 1238x599 where content=0.967 but chrome=0.749).
  useEffect(() => {
    const DESIGN_WIDTH = 1280;
    const updatePos = () => {
      const root = document.documentElement;
      const cs = getComputedStyle(root);
      const chromeScale = parseFloat(cs.getPropertyValue("--sf-canvas-scale")) || 1;
      const contentScale = parseFloat(cs.getPropertyValue("--sf-content-scale")) || chromeScale;
      const offsetX = parseFloat(cs.getPropertyValue("--sf-frame-offset-x")) || 0;
      const frameRight = offsetX + DESIGN_WIDTH * contentScale;

      const heroTitle = document.querySelector('[data-entry-section] h1[data-anim="hero-title"]');
      if (heroTitle) {
        const rect = heroTitle.getBoundingClientRect();
        const rightDist = Math.max(0, frameRight - rect.right);
        setPos({ top: rightDist, right: offsetX + rightDist });
      } else {
        // Fallback for subpages — 80/24 design-unit inset from frame top-right corner,
        // scaled by the chrome scale to match the HUD's own transform.
        setPos({ top: 80 * chromeScale, right: offsetX + 24 * chromeScale });
      }
    };

    // Initial measurement races ScaleCanvas's first applyScale (sibling effects in the
    // same commit). rAF-defer the first run so --sf-canvas-scale / --sf-frame-offset-x
    // are guaranteed set. Subsequent runs (resize, fonts.ready) are fine as-is.
    const rafId = requestAnimationFrame(updatePos);
    window.addEventListener('resize', updatePos);
    if (document.fonts) {
      document.fonts.ready.then(updatePos);
    }
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePos);
    };
  }, [pathname]); // Re-run when route changes

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
      className="fixed origin-top-right z-[var(--z-content)] flex flex-col items-end font-mono text-[var(--text-2xs)] uppercase tracking-[0.08em] text-muted-foreground pointer-events-none select-none leading-[1.6]"
      style={{
        top: `${pos.top}px`,
        right: `${pos.right}px`,
        transform: "scale(var(--sf-canvas-scale, 1))",
      }}
    >
      <span data-hud-field="section" className="text-foreground">
        {sectionLabel}
      </span>
      {!isMobile && <span data-hud-field="viewport">{viewport || "0\u00d70"}</span>}
      <span ref={sigRef} data-hud-field="sig">SIG:0.0</span>
      {!isMobile && <span ref={scrollRef} data-hud-field="scroll">0%</span>}
      <span data-hud-field="time">{time || "00:00"}</span>
    </aside>
  );
}
