"use client";

import { useEffect, useRef } from "react";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#01";

/** Scramble text effect: progressively reveals target text through random chars */
function scrambleText(
  el: HTMLElement,
  text: string,
  duration: number,
  onComplete?: () => void
) {
  const len = text.length;
  const start = performance.now();

  function step(t: number) {
    const p = Math.min((t - start) / duration, 1);
    let out = "";
    for (let i = 0; i < len; i++) {
      out +=
        p * len > i
          ? text[i]
          : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(step);
    else {
      el.textContent = text;
      onComplete?.();
    }
  }
  requestAnimationFrame(step);
}

/**
 * PageAnimations — wires up all mockup animations using vanilla JS + IntersectionObserver.
 * This component mounts once and orchestrates all page-level animations.
 * Respects prefers-reduced-motion.
 */
export function PageAnimations() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Bail on reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ── 1. Hero headline char-by-char reveal ──
    const heroTitle = document.querySelector("[data-anim='hero-title']");
    if (heroTitle) {
      const textNodes: HTMLElement[] = [];
      heroTitle.querySelectorAll("[data-anim='hero-char']").forEach((el) => {
        const span = el as HTMLElement;
        span.style.display = "inline-block";
        span.style.transform = "translateY(100%)";
        span.style.opacity = "0";
        span.style.transition =
          "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.45s";
        textNodes.push(span);
      });

      // Reveal chars with stagger after 500ms
      setTimeout(() => {
        textNodes.forEach((s, i) => {
          setTimeout(() => {
            s.style.transform = "translateY(0)";
            s.style.opacity = "1";
          }, i * 25);
        });

        // ── 2. Sequential multilingual scramble ──
        const kata = document.querySelector(
          "[data-anim='hero-katakana']"
        ) as HTMLElement;
        const farsi = document.querySelector(
          "[data-anim='hero-farsi']"
        ) as HTMLElement;
        const mandarin = document.querySelector(
          "[data-anim='hero-mandarin']"
        ) as HTMLElement;
        const subtitle = document.querySelector(
          "[data-anim='hero-subtitle']"
        ) as HTMLElement;

        const elements = [kata, farsi, mandarin].filter(Boolean);
        elements.forEach((el) => {
          if (el) el.style.opacity = "0";
        });
        if (subtitle) {
          subtitle.style.opacity = "0";
          subtitle.style.transform = "translateY(20px)";
          subtitle.style.transition = "opacity 0.6s, transform 0.6s";
        }

        const totalCharDelay = textNodes.length * 25 + 200;
        setTimeout(() => {
          // Chain: katakana → farsi → mandarin → subtitle
          function revealNext(index: number) {
            if (index >= elements.length) {
              // Subtitle fade-up
              if (subtitle) {
                subtitle.style.opacity = "1";
                subtitle.style.transform = "translateY(0)";
              }
              return;
            }
            const el = elements[index];
            const text = el.getAttribute("data-text") || el.textContent || "";
            el.style.opacity = "1";
            scrambleText(el, text, 1000, () => revealNext(index + 1));
          }
          revealNext(0);
        }, totalCharDelay);
      }, 500);
    }

    // ── 3. Nav link hover scramble ──
    document
      .querySelectorAll("[data-anim='nav-link']")
      .forEach((a) => {
        const el = a as HTMLElement;
        const orig = el.textContent || "";
        el.style.width = el.offsetWidth + "px";
        el.style.display = "inline-block";
        el.style.overflow = "hidden";
        el.addEventListener("mouseenter", () => {
          scrambleText(el, orig, 300);
        });
      });

    // ── 4. Stats count-up with digit scramble ──
    const statObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          statObs.unobserve(e.target);
          const el = e.target as HTMLElement;
          const target = parseInt(el.getAttribute("data-target") || "0");
          if (isNaN(target) || target === 0) return;

          const dur = 1000;
          const start = performance.now();
          function tick(t: number) {
            const p = Math.min((t - start) / dur, 1);
            const cur = Math.round(p * target);
            const s = String(cur);
            let out = "";
            for (let i = 0; i < s.length; i++) {
              out +=
                p < 0.9 && Math.random() > 0.6
                  ? String((Math.random() * 10) | 0)
                  : s[i];
            }
            el.textContent = out;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = String(target);
          }
          el.textContent = "0";
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    document
      .querySelectorAll("[data-anim='stat-number']")
      .forEach((el) => statObs.observe(el));

    // ── 5. Component grid staggered fade-in ──
    const cells = document.querySelectorAll("[data-anim='comp-cell']");
    cells.forEach((c) => {
      const el = c as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.5s, transform 0.5s";
    });
    const cellObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          cellObs.unobserve(e.target);
          const el = e.target as HTMLElement;
          const idx = Array.prototype.indexOf.call(cells, el);
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, (idx % 4) * 80); // Stagger within each row
        });
      },
      { threshold: 0.1 }
    );
    cells.forEach((c) => cellObs.observe(c));

    // ── 6. Yellow band parallax ──
    const band = document.querySelector(
      "[data-anim='yellow-band']"
    ) as HTMLElement;
    if (band) {
      function onScroll() {
        const r = band.getBoundingClientRect();
        const h = window.innerHeight;
        if (r.top < h && r.bottom > 0) {
          const p = (h - r.top) / (h + r.height);
          band.style.transform = `translateY(${(p - 0.5) * 30}px)`;
        }
      }
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // ── 7. Click-pop on interactive elements ──
    const popSelectors =
      "[data-anim='comp-cell'], [data-anim='cta-btn'], [data-anim='tag']";
    document.querySelectorAll(popSelectors).forEach((el) => {
      el.addEventListener("click", () => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.animation = "none";
        void htmlEl.offsetHeight; // force reflow
        htmlEl.style.animation =
          "sf-click-pop 250ms cubic-bezier(0.68, -0.2, 0.27, 1.2)";
        htmlEl.addEventListener(
          "animationend",
          () => {
            htmlEl.style.animation = "";
          },
          { once: true }
        );
      });
    });

    // ── 8. Scroll-triggered section reveals ──
    const sections = document.querySelectorAll("[data-anim='section-reveal']");
    sections.forEach((s) => {
      const el = s as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          sectionObs.unobserve(e.target);
          const el = e.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((s) => sectionObs.observe(s));
  }, []);

  return null;
}
