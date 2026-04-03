"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";

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

  // ── 1. Hero headline — SplitText char reveal ──
  const split = SplitText.create("[data-anim='hero-char']", {
    type: "chars",
  });

  gsap.set(split.chars, { y: "100%", opacity: 0 });
  gsap.to(split.chars, {
    y: 0,
    opacity: 1,
    duration: 0.35,
    ease: "power3.out",
    stagger: 0.02,
    delay: 0.3,
    onComplete: () => revealMultilingual(),
  });

  // ── 2. Multilingual scramble sequence ──
  function revealMultilingual() {
    const kata = document.querySelector("[data-anim='hero-katakana']") as HTMLElement;
    const farsi = document.querySelector("[data-anim='hero-farsi']") as HTMLElement;
    const mandarin = document.querySelector("[data-anim='hero-mandarin']") as HTMLElement;
    const subtitle = document.querySelector("[data-anim='hero-subtitle']") as HTMLElement;

    const elements = [kata, farsi, mandarin].filter(Boolean);
    if (subtitle) gsap.set(subtitle, { y: 20 });

    const tl = gsap.timeline({ delay: 0.2 });

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

  // ── 3. Hero copy flicker-in after 1.6s ──
  const heroCopy = document.querySelector("[data-anim='hero-copy']");
  if (heroCopy) {
    const flickerTl = gsap.timeline({ delay: 1.6 });
    flickerTl
      .to(heroCopy, { opacity: 0.15, duration: 0.06 })
      .to(heroCopy, { opacity: 0, duration: 0.04 })
      .to(heroCopy, { opacity: 0.3, duration: 0.06 })
      .to(heroCopy, { opacity: 0, duration: 0.05 })
      .to(heroCopy, { opacity: 0.6, duration: 0.08 })
      .to(heroCopy, { opacity: 0.2, duration: 0.04 })
      .to(heroCopy, { opacity: 0.8, duration: 0.06 })
      .to(heroCopy, { opacity: 0.5, duration: 0.03 })
      .to(heroCopy, { opacity: 1, duration: 0.1 });
  }

  // ── 4. CTA button entrance (initial state set via CSS [data-anim="cta-btn"]) ──
  gsap.to("[data-anim='cta-btn']", {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
    stagger: 0.1,
    delay: 2.0,
  });

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
          duration: 0.7,
          ease: "power2.out",
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
          x: 0,
          y: 0,
          scale: 1,
          scaleY: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: { amount: 0.5, from: "center" },
        });
      },
    });
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
}

/** Apply sharp background color shift (DU-style hard cut, no blend) */
function applyBgShift(target: string | null) {
  if (!target) return;
  const wrapper = document.getElementById("bg-shift-wrapper");
  if (!wrapper) return;

  const isDark = document.documentElement.classList.contains("dark");
  const palette: Record<string, string> = isDark
    ? { white: "var(--color-background)", black: "oklch(0.08 0 0)", primary: "oklch(0.55 0.28 350)" }
    : { white: "#fff", black: "oklch(0.145 0 0)", primary: "oklch(0.55 0.28 350)" };

  wrapper.style.backgroundColor = palette[target] || palette.white;
}

/** Page heading ScrambleText — lazy-loads ScrambleTextPlugin only when headings exist */
async function initPageHeadingScramble(headings: NodeListOf<Element>) {
  const { ScrambleTextPlugin } = await import("@/lib/gsap-plugins");
  if (!ScrambleTextPlugin) return;

  headings.forEach((el, i) => {
    const htmlEl = el as HTMLElement;
    const originalText = htmlEl.textContent || "";

    // Set initial scrambled state
    gsap.to(htmlEl, {
      duration: 0.8,
      delay: 0.1 + i * 0.05,
      scrambleText: {
        text: originalText,
        chars: "01!<>-_\\/[]{}—=+*^?#",
        speed: 0.4,
      },
    });
  });
}
