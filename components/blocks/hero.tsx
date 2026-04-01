"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="mt-[80px] grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-80px)] border-b-4 border-foreground">
      {/* Left — Black panel */}
      <div className="bg-foreground text-background px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)] flex flex-col justify-center relative overflow-hidden">
        {/* Canvas mesh background */}
        <canvas
          className="absolute inset-0 w-full h-full opacity-35 z-0"
          style={{ pointerEvents: "none" }}
          aria-hidden="true"
        />

        {/* Halftone decorative circle */}
        <div
          className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.15]"
          style={{
            background:
              "radial-gradient(circle, transparent 30%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.3) 32%, transparent 32%), radial-gradient(circle, transparent 30%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.3) 32%, transparent 32%)",
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 4px 4px",
            filter: "contrast(2)",
          }}
          aria-hidden="true"
        />

        {/* Magenta accent line */}
        <div
          className="absolute bottom-10 left-[clamp(20px,4vw,48px)] w-[200px] h-[3px] bg-primary z-10"
          aria-hidden="true"
        />

        {/* Title: SIGNAL//FIELD */}
        <div className="relative z-10">
          <div
            data-anim="hero-title"
            className="text-[clamp(48px,11vw,140px)] leading-[0.85] tracking-[-0.03em] text-background uppercase"
            style={{
              fontFamily: "var(--font-anton)",
              textShadow: "0 1px 0 rgba(255,255,255,0.05), 0 -1px 0 rgba(0,0,0,0.3)",
            }}
          >
            <span data-anim="hero-char">S</span><span data-anim="hero-char">I</span><span data-anim="hero-char">G</span><span data-anim="hero-char">N</span><span data-anim="hero-char">A</span><span data-anim="hero-char">L</span>
            <span className="block text-primary text-[clamp(40px,9vw,120px)]">
              <span className="text-[oklch(0.55_0_0)] text-[clamp(28px,6vw,80px)]">//</span>
              <span data-anim="hero-char">F</span><span data-anim="hero-char">I</span><span data-anim="hero-char">E</span><span data-anim="hero-char">L</span><span data-anim="hero-char">D</span>
            </span>
          </div>
        </div>

        {/* Multilingual text */}
        <div className="relative z-10 mt-3">
          <p data-anim="hero-katakana" data-text="シグナルフレーム™" className="text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(12px,1.5vw,18px)]">
            シグナルフレーム™
          </p>
          <p
            data-anim="hero-farsi"
            data-text="سیگنال‌فریم™"
            className="text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(12px,1.5vw,18px)] font-black mt-1"
            dir="rtl"
            style={{ textAlign: "left" }}
          >
            سیگنال‌فریم™
          </p>
          <p data-anim="hero-mandarin" data-text="信号框架™" className="text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(12px,1.5vw,18px)] font-black mt-2">
            信号框架™
          </p>
        </div>

        {/* Subtitle */}
        <p data-anim="hero-subtitle" className="mt-8 text-[oklch(0.55_0_0)] uppercase tracking-[0.2em] text-[clamp(10px,1.2vw,13px)] max-w-[420px] relative z-10">
          DETERMINISTIC INTERFACE. GENERATIVE EXPRESSION.<br />
          THE PROGRAMMABLE DESIGN SYSTEM FOR DIGITAL SURFACES.
        </p>
      </div>

      {/* Right — White panel */}
      <div className="bg-background px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)] flex flex-col justify-center relative">
        {/* Manifesto */}
        <p className="text-[clamp(16px,2.5vw,28px)] leading-[1.4] font-bold text-foreground max-w-[520px]">
          Accept the interface into your life.
          <span className="text-[14px] align-super text-muted-foreground">™</span>{" "}
          A dual-layer design system that separates{" "}
          <em className="text-primary not-italic">what you read</em> from{" "}
          <em className="text-primary not-italic">what you feel</em>.{" "}
          <em className="text-primary not-italic">340+</em> components. One API. Zero compromise.
        </p>

        {/* CTAs with border-draw animation */}
        <div className="flex gap-4 mt-10">
          <Link href="/start" className="group relative inline-block no-underline">
            <span data-anim="cta-btn" className="hero-cta-btn primary relative inline-block bg-foreground text-background px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] border-2 border-foreground cursor-pointer overflow-hidden">
              GET STARTED
              <span className="bd-span"><span className="bd-top" /><span className="bd-right" /><span className="bd-bottom" /><span className="bd-left" /></span>
            </span>
          </Link>
          <Link href="https://github.com" className="group relative inline-block no-underline">
            <span data-anim="cta-btn" className="hero-cta-btn secondary relative inline-block bg-transparent text-foreground px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] border-2 border-foreground cursor-pointer overflow-hidden">
              VIEW ON GITHUB
              <span className="bd-span"><span className="bd-top" /><span className="bd-right" /><span className="bd-bottom" /><span className="bd-left" /></span>
            </span>
          </Link>
        </div>

        {/* Version tag */}
        <div className="absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          SF//UX v2.0.0 · 2026
        </div>
      </div>

      {/* Border-draw + CTA hover styles */}
      <style jsx>{`
        .hero-cta-btn {
          will-change: transform;
          transition: transform 600ms linear(0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141, 0.191, 0.25, 0.316, 0.391, 0.473, 0.562, 0.66, 0.765, 0.878, 1.0, 1.025, 1.042, 1.05, 1.05, 1.042, 1.028, 1.009, 0.988, 0.965, 0.945, 0.928, 0.916, 0.908, 0.906, 0.91, 0.918, 0.931, 0.947, 0.965, 0.984, 1.0),
                      color 100ms ease,
                      background-color 100ms ease,
                      border-color 100ms ease;
        }
        .hero-cta-btn:hover {
          transform: translateY(-2px);
          transition: transform 200ms cubic-bezier(0.3, 0.7, 0.4, 1.5),
                      color 100ms ease,
                      background-color 100ms ease,
                      border-color 100ms ease;
        }
        .hero-cta-btn.primary:hover {
          background: var(--color-background);
          color: var(--color-foreground);
          border-color: var(--color-foreground);
        }
        .hero-cta-btn.secondary:hover {
          border-width: 3px;
          padding: 13px 27px;
        }
        .bd-span {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .bd-top, .bd-right, .bd-bottom, .bd-left {
          position: absolute;
          background: oklch(0.65 0.29 350);
        }
        .bd-top {
          top: -2px; left: -2px; height: 3px; width: 0;
          transition: width 0.1s ease 0s;
        }
        .bd-right {
          top: -2px; right: -2px; width: 3px; height: 0;
          transition: height 0.1s ease 0.1s;
        }
        .bd-bottom {
          bottom: -2px; right: -2px; height: 3px; width: 0;
          transition: width 0.1s ease 0.2s;
        }
        .bd-left {
          bottom: -2px; left: -2px; width: 3px; height: 0;
          transition: height 0.1s ease 0.3s;
        }
        .hero-cta-btn:hover .bd-top { width: calc(100% + 4px); }
        .hero-cta-btn:hover .bd-right { height: calc(100% + 4px); }
        .hero-cta-btn:hover .bd-bottom { width: calc(100% + 4px); }
        .hero-cta-btn:hover .bd-left { height: calc(100% + 4px); }
      `}</style>
    </section>
  );
}
