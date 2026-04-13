"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";
import { triggerColorStutter } from "@/lib/color-stutter";

/**
 * PageAnimations — wires up all page-level GSAP animations.
 * Core animations (ScrollTrigger reveals, stats, tags, click-pop) use gsap-core (~8KB).
 * Hero-specific animations (SplitText, ScrambleText) lazy-load gsap-plugins only when
 * hero targets exist on the page, avoiding ~75KB on non-homepage routes.
 */
export function PageAnimations() {
  useEffect(() => {
    // Lazy-load initReducedMotion from plugins (it's defined there)
    let cleanupMotion: (() => void) | undefined;
    const clickCleanups: Array<() => void> = [];
    let ctx: gsap.Context;

    const cancelledRef = { current: false };

    let heroCtx: gsap.Context | undefined;

    async function init() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Still need to load initReducedMotion to handle runtime MQ changes
        const { initReducedMotion } = await import("@/lib/gsap-plugins");
        if (cancelledRef.current) return;
        cleanupMotion = initReducedMotion();
        return;
      }

      // Check if any animation targets exist before loading plugins
      const hasTargets = document.querySelector("[data-anim]");
      if (!hasTargets) return;

      const { initReducedMotion } = await import("@/lib/gsap-plugins");
      if (cancelledRef.current) return;
      cleanupMotion = initReducedMotion();

      ctx = gsap.context(() => {
        // ── Core animations — always run ──
        initCoreAnimations(clickCleanups);
      });

      // Font-ready ScrollTrigger recalculation — prevents CLS from font reflow
      // after Anton/Electrolize swap in. Must fire after GSAP context is established.
      document.fonts.ready.then(() => {
        if (!cancelledRef.current) ScrollTrigger.refresh();
      });

      // ── Hero animations — loaded async, tracked in a separate context ──
      const heroTitle = document.querySelector("[data-anim='hero-title']");
      if (heroTitle) {
        await initHeroAnimations(cancelledRef, (c) => { heroCtx = c; });
      }
    }

    init();

    return () => {
      cancelledRef.current = true;
      ctx?.revert();
      heroCtx?.revert();
      clickCleanups.forEach((fn) => fn());
      cleanupMotion?.();
    };
  }, []);

  return null;
}

/** Hero SplitText + ScrambleText — lazy-loaded from gsap-plugins, tracked in own context */
async function initHeroAnimations(
  cancelledRef: { current: boolean },
  registerCtx: (ctx: gsap.Context) => void
) {
  const { SplitText } = await import("@/lib/gsap-plugins");
  if (cancelledRef.current) return;

  const ctx = gsap.context(() => {

  // ── 0. Hero mesh — FIRST visible motion, fires at delay:0 (<500ms from load) ──
  // Initial opacity:0 is set in CSS ([data-anim="hero-mesh"]) and in hero.tsx wrapper.
  // GSAP controls the fade-in to 0.45 opacity.
  // Guard: hero-mesh was retired at Phase 30 (commit 86237fd); only animate if present.
  const heroMesh = document.querySelector("[data-anim='hero-mesh']");
  if (heroMesh) {
    gsap.fromTo(
      heroMesh,
      { opacity: 0 },
      { opacity: 0.45, duration: 0.3, ease: "power2.out", delay: 0 }
    );
  }

  // ── 1. Hero slashes — slide left to right (fires as chars begin) ──
  const slashes = document.querySelector("[data-anim='hero-slashes']");
  if (slashes) {
    gsap.set(slashes, { x: "-100vw" });
    gsap.to(slashes, { x: 0, duration: 3, ease: "power2.out", delay: 0.3 });
  }

  // ── 2. Hero headline — char reveal (fires on load) ──
  const heroChars = document.querySelectorAll("[data-anim='hero-char']");
  if (heroChars.length > 0) {
    gsap.set(heroChars, { y: "100%", opacity: 0, display: "inline-block" });
    
    // Create a timeline for the roll up and flicker effect
    const charTl = gsap.timeline({
      onComplete: () => revealMultilingual(),
    });
    
    // Roll up
    charTl.to(heroChars, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power3.in",
      stagger: 0,
      delay: 0,
    });
    
    // Flicker effect
    charTl.to(heroChars, {
      opacity: 0.3,
      duration: 0.05,
      stagger: { amount: 0.2, from: "random" },
    })
    .to(heroChars, {
      opacity: 1,
      duration: 0.05,
      stagger: { amount: 0.2, from: "random" },
    })
    .to(heroChars, {
      opacity: 0.7,
      duration: 0.05,
      stagger: { amount: 0.1, from: "random" },
    })
    .to(heroChars, {
      opacity: 1,
      duration: 0.05,
      stagger: { amount: 0.1, from: "random" },
    });
  } else {
    revealMultilingual();
  }

  // ── 3. Multilingual scramble sequence (fires ~1.3s after load) ──
  function revealMultilingual() {
    const kata = document.querySelector("[data-anim='hero-katakana']") as HTMLElement;
    const farsi = document.querySelector("[data-anim='hero-farsi']") as HTMLElement;
    const mandarin = document.querySelector("[data-anim='hero-mandarin']") as HTMLElement;
    const subtitle = document.querySelector("[data-anim='hero-subtitle']") as HTMLElement;

    const elements = [kata, farsi, mandarin].filter(Boolean);
    if (subtitle) gsap.set(subtitle, { y: 20 });

    const tl = gsap.timeline({ delay: 0.3 });

    elements.forEach((el) => {
      const text = el.getAttribute("data-text") || el.textContent || "";
      tl.to(el, {
        opacity: 1,
        duration: 0.01,
      }).to(el, {
        duration: 0.8,
        scrambleText: {
          text,
          chars: "!<>-_\\/[]{}—=+*^?#01",
          speed: 0.4,
        },
      });
    });

    if (subtitle) {
      tl.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
    }
  }

  // ── 4. Hero feel — "feel" blur bloom (right panel) ──
  const heroFeel = document.querySelector("[data-anim='hero-feel']");
  if (heroFeel) {
    gsap.to(heroFeel, { opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out", delay: 0.5 });
  }

  // ── 5. Hero copy — "a system you can" slow fade ──
  const heroCopy = document.querySelector("[data-anim='hero-copy']");
  if (heroCopy) {
    gsap.to(heroCopy, { opacity: 1, duration: 5, ease: "power1.inOut", delay: 1.0 });
  }

  // ── 6. CTA button entrance (initial state set via CSS [data-anim="cta-btn"]) ──
  // Guard: cta-btn was retired at Phase 30 (commit 86237fd); only animate if present.
  const ctaBtn = document.querySelector("[data-anim='cta-btn']");
  if (ctaBtn) {
    gsap.to("[data-anim='cta-btn']", {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.1,
      delay: 1.5,
    });
  }

  // ── 7. Accent color cycle — flash through palette and land on magenta ──
  const accentColors = [
    "oklch(0.7 0.18 195)",   // Cyan
    "oklch(0.75 0.3 140)",   // Lime
    "oklch(0.75 0.18 75)",   // Amber
    "oklch(0.65 0.22 25)",   // Coral
    "oklch(0.55 0.25 290)",  // Violet
    "oklch(0.55 0.25 10)",   // Red
    "oklch(0.65 0.3 350)",   // Magenta (home)
  ];
  const root = document.documentElement;
  const colorTl = gsap.timeline({ delay: 2.0 });
  accentColors.forEach((color, i) => {
    const isLast = i === accentColors.length - 1;
    colorTl
      .call(() => root.style.setProperty("--sfx-primary", "transparent"))
      .to({}, { duration: 0.015 })
      .call(() => {
        root.style.setProperty("--sfx-primary", color);
        if (isLast) triggerColorStutter();
      })
      .to({}, { duration: isLast ? 0 : 0.12 });
  });

  // ── 8. Hero copy dot — period punctuation, lands last ──
  const heroDot = document.querySelector("[data-anim='hero-copy-dot']");
  if (heroDot) {
    gsap.to(heroDot, { opacity: 1, duration: 3, ease: "power1.inOut", delay: 3.0 });
  }

  // ── 9. Hero slash moment — canonical magenta signal-intensity scrub (VL-05) ──
  // Triangle curve peaks at t=0.3 so the signal-burst hits while the wordmark
  // is still center-viewport (entry-section 810px, wordmark centered ~y=405,
  // so t=0.3 ≈ scrollY 243 keeps wordmark on-screen). Rise: 0.25 → 1.0 over
  // t=[0, 0.3]. Fall: 1.0 → 0.2 over t=[0.3, 1.0] as thesis emerges.
  // FRAME/SIGNAL read: the signal punches through the ghosted wordmark as the
  // user engages, then recedes to let THESIS take over. Ikeda-lineage.
  const slashMoment = document.querySelector("[data-anim='hero-slash-moment']") as HTMLElement | null;
  const entrySection = document.querySelector("[data-entry-section]") as HTMLElement | null;
  if (slashMoment && entrySection) {
    ScrollTrigger.create({
      trigger: entrySection,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        const t = self.progress;
        const peak = 0.3;
        const intensity = t < peak
          ? 0.25 + (t / peak) * 0.75         // 0.25 → 1.0
          : 1.0 - ((t - peak) / (1 - peak)) * 0.8; // 1.0 → 0.2
        slashMoment.style.opacity = String(intensity);
      },
    });
  }

  }); // end gsap.context

  registerCtx(ctx);
}

/** Core ScrollTrigger animations — use gsap-core only */
function initCoreAnimations(clickCleanups: Array<() => void>) {
  // ── Section reveals (initial state set via CSS [data-anim="section-reveal"]) ──
  document.querySelectorAll("[data-anim='section-reveal']").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          visibility: "visible",
          duration: 0.034, // --duration-instant (34ms) — DU-style hard cut
          ease: "none",    // No easing on hard cut
        });
      },
    });
  });

  // ── Ghost labels — reveal with parent section scroll ──
  document.querySelectorAll("[data-anim='ghost-label']").forEach((el) => {
    ScrollTrigger.create({
      trigger: el.parentElement ?? el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 0.03,
          visibility: "visible",
          duration: 0.034,
          ease: "none",
        });
      },
    });
  });

  // ── Page heading ScrambleText on entry ──
  const pageHeadings = document.querySelectorAll("[data-anim='page-heading']");
  if (pageHeadings.length) {
    initPageHeadingScramble(pageHeadings);
  }

  // ── Stats count-up (proxy-driven — avoids direct GSAP textContent mutation) ──
  document.querySelectorAll("[data-anim='stat-number']").forEach((el) => {
    const htmlEl = el as HTMLElement;
    const target = parseInt(htmlEl.getAttribute("data-target") || "0");
    if (isNaN(target) || target === 0) return;

    ScrollTrigger.create({
      trigger: htmlEl,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          duration: 1.2,
          ease: "power1.out",
          onUpdate: () => {
            const v = Math.round(proxy.val);
            const jitter = Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 3);
            htmlEl.textContent = String(v + jitter);
          },
          onComplete: () => {
            htmlEl.textContent = String(target);
            // Slam effect — number lands with a micro-scale punch
            gsap.fromTo(
              htmlEl,
              { scaleY: 1.06, scaleX: 0.97 },
              { scaleY: 1, scaleX: 1, duration: 0.3, ease: "back.out(2)" }
            );
          },
        });
      },
    });
  });

  // ── Component grid converge on scroll (opacity:0 set via CSS [data-anim="comp-cell"]) ──
  const cells = document.querySelectorAll("[data-anim='comp-cell']");
  if (cells.length) {
    const cols = 4;
    const centerCol = (cols - 1) / 2;
    const rows = Math.ceil(cells.length / cols);
    const centerRow = (rows - 1) / 2;

    ScrollTrigger.create({
      trigger: cells[0],
      start: "top 90%",
      once: true,
      onEnter: () => {
        // Set offsets inside onEnter — avoids hydration mismatch from gsap.set()
        cells.forEach((cell, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const dx = (col - centerCol) * 120;
          const dy = (row - centerRow) * 80;
          gsap.set(cell, { x: dx, y: dy, scale: 0.85, scaleY: 0.98 });
        });

        gsap.to(cells, {
          opacity: 1,
          visibility: "visible",
          x: 0,
          y: 0,
          scale: 1,
          scaleY: 1,
          duration: 1.6,
          delay: 0.5,
          ease: "power3.out",
          stagger: { amount: 1.2, from: "center" },
        });
      },
    });

    // Bounce cells on viewport resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cells.forEach((cell, i) => {
          gsap.fromTo(cell,
            { scale: 0.96 },
            { scale: 1, duration: 0.4, delay: i * 0.03, ease: "back.out(3)" }
          );
        });
      }, 100);
    };
    window.addEventListener("resize", onResize);
    clickCleanups.push(() => { window.removeEventListener("resize", onResize); clearTimeout(resizeTimer); });
  }

  // ── Tag pill entrance (initial state set via CSS [data-anim="tag"]) ──
  document.querySelectorAll("[data-anim='tag']").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      },
    });
  });

  // ── Yellow band parallax (pure ScrollTrigger — avoids GSAP transform cache injection) ──
  const band = document.querySelector("[data-anim='yellow-band']") as HTMLElement;
  if (band) {
    ScrollTrigger.create({
      trigger: band,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        band.style.transform = `translateY(${-30 * self.progress}px)`;
      },
    });
  }

  // ── Homepage background color shifts (sharp cuts between sections) ──
  document.querySelectorAll("[data-bg-shift]").forEach((el) => {
    const target = (el as HTMLElement).getAttribute("data-bg-shift");
    ScrollTrigger.create({
      trigger: el,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => applyBgShift(target),
      onEnterBack: () => applyBgShift(target),
    });
  });

  // ── Click-pop on interactive elements ──
  const popSelectors = "[data-anim='comp-cell'], [data-anim='cta-btn'], [data-anim='tag']";
  document.querySelectorAll(popSelectors).forEach((el) => {
    const handler = () => {
      gsap.fromTo(
        el,
        { scale: 1 },
        { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    };
    el.addEventListener("click", handler);
    clickCleanups.push(() => el.removeEventListener("click", handler));
  });

  // ── Staggered grid entry (40ms stagger via ScrollTrigger batch) ──
  ScrollTrigger.batch("[data-anim='stagger'] > *", {
    interval: 0.04,    // 40ms grouping window
    batchMax: 12,      // max items per batch
    start: "top 85%",
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.04,  // 40ms per item
        ease: "power2.out",
      });
    },
    once: true,
  });
}

/** Apply sharp background color shift (DU-style hard cut, no blend) */
function applyBgShift(target: string | null) {
  if (!target) return;
  const wrapper = document.getElementById("bg-shift-wrapper");
  if (!wrapper) return;

  const fg = getComputedStyle(document.documentElement).getPropertyValue('--sfx-foreground').trim() || 'oklch(0.985 0 0)';
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--sfx-background').trim() || 'oklch(0.145 0 0)';
  const primary = getComputedStyle(document.documentElement).getPropertyValue('--sfx-primary').trim() || 'oklch(0.65 0.3 350)';

  const isDark = document.documentElement.classList.contains("dark");
  const palette: Record<string, string> = isDark
    ? { white: "var(--color-background)", black: "oklch(0.08 0 0)", primary }
    : { white: fg, black: bg, primary };

  const color = palette[target] || palette.white;
  // "white" is the CSS default — clear inline style instead of setting it
  // to avoid creating a style attribute that triggers hydration mismatch
  if (target === "white") {
    wrapper.style.removeProperty("background-color");
  } else {
    wrapper.style.backgroundColor = color;
  }
}

/** Page heading ScrambleText — lazy-loads ScrambleTextPlugin only when headings exist */
async function initPageHeadingScramble(headings: NodeListOf<Element>) {
  const { ScrambleTextPlugin } = await import("@/lib/gsap-plugins");
  if (!ScrambleTextPlugin) return;

  headings.forEach((el, i) => {
    const htmlEl = el as HTMLElement;
    const originalText = htmlEl.textContent || "";

    ScrollTrigger.create({
      trigger: htmlEl,
      start: "top bottom", // fires even if heading is already in viewport
      once: true,
      onEnter: () => {
        gsap.to(htmlEl, {
          duration: 0.8,
          delay: 0.1 + i * 0.05,
          scrambleText: {
            text: originalText,
            chars: "01!<>-_\\/[]{}—=+*^?#",
            speed: 0.4,
          },
        });
      },
    });
  });
}
