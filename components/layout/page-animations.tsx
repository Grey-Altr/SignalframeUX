"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-plugins";

/**
 * PageAnimations — wires up all page-level GSAP animations.
 * Respects prefers-reduced-motion (handled globally in gsap-plugins.ts).
 */
export function PageAnimations() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // ── 1. Hero headline — SplitText char reveal ──
      const heroTitle = document.querySelector("[data-anim='hero-title']");
      if (heroTitle) {
        const split = SplitText.create("[data-anim='hero-char']", {
          type: "chars",
        });

        gsap.set(split.chars, { y: "100%", opacity: 0 });
        gsap.to(split.chars, {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.025,
          delay: 0.5,
          onComplete: () => revealMultilingual(),
        });
      }

      // ── 2. Multilingual scramble sequence ──
      function revealMultilingual() {
        const kata = document.querySelector("[data-anim='hero-katakana']") as HTMLElement;
        const farsi = document.querySelector("[data-anim='hero-farsi']") as HTMLElement;
        const mandarin = document.querySelector("[data-anim='hero-mandarin']") as HTMLElement;
        const subtitle = document.querySelector("[data-anim='hero-subtitle']") as HTMLElement;

        const elements = [kata, farsi, mandarin].filter(Boolean);
        elements.forEach((el) => gsap.set(el, { opacity: 0 }));
        if (subtitle) gsap.set(subtitle, { opacity: 0, y: 20 });

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

      // ── 3. Hero copy flicker-in after 3.5s ──
      const heroCopy = document.querySelector("[data-anim='hero-copy']");
      if (heroCopy) {
        const flickerTl = gsap.timeline({ delay: 3.5 });
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

      // ── 4. CTA button entrance ──
      gsap.from("[data-anim='cta-btn']", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        delay: 4.2,
      });

      // ── 4. Section reveals with ScrollTrigger ──
      document.querySelectorAll("[data-anim='section-reveal']").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });

      // ── 5. Stats count-up with ScrollTrigger ──
      document.querySelectorAll("[data-anim='stat-number']").forEach((el) => {
        const htmlEl = el as HTMLElement;
        const target = parseInt(htmlEl.getAttribute("data-target") || "0");
        if (isNaN(target) || target === 0) return;

        ScrollTrigger.create({
          trigger: htmlEl,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.from(htmlEl, {
              textContent: 0,
              duration: 1.2,
              ease: "power1.out",
              snap: { textContent: 1 },
              onUpdate: function () {
                const val = Math.round(parseFloat(htmlEl.textContent || "0"));
                // Scramble effect during count
                if (Math.random() > 0.5) {
                  htmlEl.textContent = String(val);
                } else {
                  htmlEl.textContent = String(val + Math.floor(Math.random() * 3));
                }
              },
              onComplete: () => {
                htmlEl.textContent = String(target);
              },
            });
          },
        });
      });

      // ── 6. Component grid converge on scroll ──
      const cells = document.querySelectorAll("[data-anim='comp-cell']");
      if (cells.length) {
        const cols = 4;
        const centerCol = (cols - 1) / 2;
        const rows = Math.ceil(cells.length / cols);
        const centerRow = (rows - 1) / 2;

        cells.forEach((cell, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          // Direction away from grid center
          const dx = (col - centerCol) * 120;
          const dy = (row - centerRow) * 80;
          gsap.set(cell, { opacity: 0, x: dx, y: dy, scale: 0.85 });
        });

        ScrollTrigger.create({
          trigger: cells[0],
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(cells, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: { amount: 0.5, from: "center" },
            });
          },
        });
      }

      // ── 7. Tag pill entrance ──
      document.querySelectorAll("[data-anim='tag']").forEach((el) => {
        gsap.from(el, {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      });

      // ── 8. Yellow band parallax ──
      const band = document.querySelector("[data-anim='yellow-band']") as HTMLElement;
      if (band) {
        gsap.to(band, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: band,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ── 9. Click-pop on interactive elements ──
      const popSelectors = "[data-anim='comp-cell'], [data-anim='cta-btn'], [data-anim='tag']";
      document.querySelectorAll(popSelectors).forEach((el) => {
        el.addEventListener("click", () => {
          gsap.fromTo(
            el,
            { scale: 1 },
            { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }
          );
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
