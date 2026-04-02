"use client";

import Link from "next/link";
import { HeroMesh } from "@/components/animation/hero-mesh";

export function Hero() {
  return (
    <section className="mt-[var(--nav-height)] grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-var(--nav-height))] border-b-4 border-foreground">
      {/* Left — Black panel */}
      <div className="bg-foreground dark:bg-[var(--sf-darker-surface)] text-background dark:text-foreground px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)] flex flex-col justify-center relative overflow-hidden">
        {/* Canvas mesh background */}
        <HeroMesh className="absolute inset-0 z-0 opacity-[0.45]" />

        {/* Halftone decorative circle */}
        <div
          className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.15]"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background:
              "radial-gradient(circle, transparent 30%, oklch(1 0 0 / 0.3) 30%, oklch(1 0 0 / 0.3) 32%, transparent 32%), radial-gradient(circle, transparent 30%, oklch(1 0 0 / 0.3) 30%, oklch(1 0 0 / 0.3) 32%, transparent 32%)",
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

        {/* Title: SIGNAL//FRAME */}
        <div className="relative z-10">
          <h1
            data-anim="hero-title"
            aria-label="SignalframeUX"
            className="sf-display text-[clamp(48px,11vw,140px)] leading-[0.85] tracking-[-0.03em] text-background dark:text-foreground uppercase"
            style={{
              textShadow: "0 1px 0 oklch(1 0 0 / 0.05), 0 -1px 0 oklch(0 0 0 / 0.3)",
            }}
          >
            <span data-anim="hero-char" suppressHydrationWarning>S</span><span data-anim="hero-char" suppressHydrationWarning>I</span><span data-anim="hero-char" suppressHydrationWarning>G</span><span data-anim="hero-char" suppressHydrationWarning>N</span><span data-anim="hero-char" suppressHydrationWarning>A</span><span data-anim="hero-char" suppressHydrationWarning>L</span>
            <span className="block text-primary text-[clamp(40px,9vw,120px)]">
              <span className="text-[var(--sf-dim-text)] text-[clamp(28px,6vw,80px)]">//</span>
              <span data-anim="hero-char" suppressHydrationWarning>F</span><span data-anim="hero-char" suppressHydrationWarning>R</span><span data-anim="hero-char" suppressHydrationWarning>A</span><span data-anim="hero-char" suppressHydrationWarning>M</span><span data-anim="hero-char" suppressHydrationWarning>E</span>
            </span>
          </h1>
        </div>

        {/* Multilingual text */}
        <div className="relative z-10 mt-3">
          <p lang="ja" data-anim="hero-katakana" data-text="シグナルフレーム™" className="sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(12px,1.5vw,18px)] font-bold">
            シグナルフレーム™
          </p>
          <p
            lang="fa"
            data-anim="hero-farsi"
            data-text="سیگنال‌فریم™"
            className="sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(12px,1.5vw,18px)] font-black -mt-[2px]"
            dir="rtl"
            style={{ textAlign: "start" }}
          >
            سیگنال‌فریم™
          </p>
          <p lang="zh" data-anim="hero-mandarin" data-text="信号框架™" className="sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(12px,1.5vw,18px)] font-black mt-2">
            信号框架™
          </p>
        </div>

        {/* Subtitle */}
        <p data-anim="hero-subtitle" suppressHydrationWarning className="sf-hero-deferred mt-8 text-[var(--sf-dim-text)] dark:text-muted-foreground uppercase tracking-[0.2em] text-[clamp(10px,1.2vw,13px)] max-w-[420px] relative z-10">
          DETERMINISTIC INTERFACE. GENERATIVE EXPRESSION.<br />
          THE PROGRAMMABLE DESIGN SYSTEM FOR DIGITAL SURFACES.
        </p>
      </div>

      {/* Right — White panel */}
      <div className="bg-background px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)] flex flex-col justify-center relative">
        {/* Manifesto */}
        <p data-anim="hero-copy" suppressHydrationWarning className="sf-hero-deferred text-[clamp(16px,2.5vw,28px)] leading-[1.4] font-bold text-foreground max-w-[520px]">
          Accept the interface into your life.
          <span className="text-[14px] align-super text-muted-foreground">™</span>{" "}
          A dual-layer design system that separates{" "}
          <span className="text-primary">what you see</span> from{" "}
          <span className="text-primary">what you feel</span>.{" "}
          <span className="text-primary">340+</span> components. One API. Zero compromise.
        </p>

        {/* CTAs with border-draw animation */}
        <div className="flex gap-4 mt-10">
          <Link
            href="/start"
            data-anim="cta-btn"
            suppressHydrationWarning
            className="hero-cta-btn primary relative inline-block no-underline bg-foreground text-background px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] border-2 border-foreground overflow-hidden"
          >
            GET STARTED
            <span className="bd-span" aria-hidden="true" />
          </Link>
          <Link
            href="https://github.com/signalframeux"
            data-anim="cta-btn"
            suppressHydrationWarning
            className="hero-cta-btn secondary relative inline-block no-underline bg-transparent text-foreground px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] border-2 border-foreground overflow-hidden"
          >
            VIEW ON GITHUB
            <span className="bd-span" aria-hidden="true" />
          </Link>
        </div>

        {/* Version tag */}
        <div className="absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          SF//UX v2.0.0 · 2026
        </div>
      </div>

    </section>
  );
}
