import Link from "next/link";
import { HeroMesh } from "@/components/animation/hero-mesh";
import { ColorCycleFrame } from "@/components/animation/color-cycle-frame";

export function Hero() {
  return (
    <section className="mt-0 grid grid-cols-1 md:grid-cols-2 min-h-screen border-b-4 border-foreground">
      {/* Left — Black panel */}
      <div className="bg-foreground dark:bg-[var(--sf-darker-surface)] text-background dark:text-foreground px-[clamp(24px,5vw,48px)] pt-[calc(10vh+clamp(24px,5vw,60px))] pb-[clamp(24px,5vw,60px)] flex flex-col justify-center relative overflow-hidden">
        {/* Canvas mesh background */}
        <HeroMesh className="absolute inset-0 z-0 opacity-[0.45]" />

        {/* Halftone decorative circle */}
        <div
          className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.15]"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background:
              "radial-gradient(circle, transparent 30%, var(--sf-halftone-dot) 30%, var(--sf-halftone-dot) 32%, transparent 32%), radial-gradient(circle, transparent 30%, var(--sf-halftone-dot) 30%, var(--sf-halftone-dot) 32%, transparent 32%)",
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 4px 4px",
            filter: "contrast(2)",
          }}
          aria-hidden="true"
        />

        {/* Magenta accent line */}
        <div
          className="absolute bottom-10 left-[clamp(20px,4vw,48px)] w-[200px] h-[3px] bg-primary z-[var(--z-content)]"
          aria-hidden="true"
        />

        {/* Title: SIGNAL//FRAME */}
        <div className="relative z-[var(--z-content)]">
          <h1
            data-anim="hero-title"
            aria-label="SignalframeUX"
            suppressHydrationWarning
            className="sf-display text-[clamp(119px,27.2vw,347px)] leading-[0.55] tracking-[-0.03em] text-background dark:text-foreground uppercase"
            style={{
              textShadow: "0 1px 0 var(--sf-text-shadow-light), 0 -1px 0 var(--sf-text-shadow-dark)",
            }}
          >
            <ColorCycleFrame className="inline-block text-primary">
              <span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">S</span><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">I</span><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">G</span><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">N</span><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">A</span><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">L</span>
            </ColorCycleFrame>
            <span className="block text-background dark:text-foreground text-[clamp(99px,22.3vw,297px)] -mt-[0.05em]">
              <span aria-hidden="true" className="text-[var(--sf-dim-text)] text-[clamp(69px,14.85vw,198px)] inline-block sf-hero-slash-enter relative z-10">//</span>
              <span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">F</span><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">R</span><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">A</span><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">M</span><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char">E</span>
            </span>
          </h1>
        </div>

        {/* Multilingual text */}
        <div className="relative z-[9998] mt-3">
          <p lang="ja" data-anim="hero-katakana" data-text="シグナルフレーム™" className="sf-glitch sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(10.8px,1.34vw,16.2px)] font-bold">
            シグナルフレーム™
          </p>
          <p
            lang="fa"
            data-anim="hero-farsi"
            data-text="سیگنال‌فریم™"
            className="sf-glitch sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(18.2px,2.24vw,26.9px)] font-black mt-[1px]"
            dir="rtl"
            style={{ textAlign: "end" }}
          >
            سیگنال‌فریم™
          </p>
          <p lang="zh" data-anim="hero-mandarin" data-text="信号框架™" className="sf-glitch sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(10.8px,1.34vw,16.2px)] font-black mt-2">
            信号框架™
          </p>
        </div>

        {/* Subtitle */}
        <p data-anim="hero-subtitle" className="sf-hero-deferred mt-4 text-[var(--sf-dim-text)] dark:text-muted-foreground uppercase tracking-[0.2em] text-[clamp(12px,1.5vw,16px)] max-w-[520px] relative z-[var(--z-content)]" style={{ fontFamily: "var(--font-electrolize)" }}>
          DETERMINISTIC INTERFACE. GENERATIVE EXPRESSION.<br />
          THE PROGRAMMABLE DESIGN SYSTEM FOR DIGITAL SURFACES.
        </p>
      </div>

      {/* Right — White panel */}
      <div className="bg-background px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)] flex flex-col justify-center relative">
        {/* Manifesto */}
        <p data-anim="hero-copy" className="text-[clamp(24px,3.75vw,42px)] leading-[1.4] font-bold text-foreground max-w-[520px] tracking-tighter mt-16">
          <span className="sf-typewriter">is a system you can{" "}</span>
          <ColorCycleFrame className="inline-block">
            <span className="text-primary sf-typewriter sf-typewriter-feel ml-2">feel</span>
          </ColorCycleFrame>
          <span className="sf-period-fade text-black dark:text-white">.</span>
        </p>

        {/* CTAs with border-draw animation */}
        <div className="flex gap-4 mt-6">
          <Link
            href="/start"
            data-anim="cta-btn"
            className="hero-cta-btn primary relative inline-block no-underline bg-foreground text-background px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] border-2 border-foreground overflow-hidden"
          >
            GET STARTED
            <span className="bd-span" aria-hidden="true" />
          </Link>
          <a
            href="https://github.com/signalframeux"
            target="_blank"
            rel="noopener noreferrer"
            data-anim="cta-btn"
            className="hero-cta-btn secondary relative inline-block no-underline bg-transparent text-foreground px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] border-2 border-foreground overflow-hidden"
          >
            VIEW ON GITHUB
            <span className="sr-only">(opens in new tab)</span>
            <span className="bd-span" aria-hidden="true" />
          </a>
        </div>

        {/* Version tag */}
        <div className="absolute bottom-6 right-6 text-2xs uppercase tracking-[0.2em] text-muted-foreground">
          SF//UX v2.0.0 · 2026
        </div>
      </div>

    </section>
  );
}
