import Link from "next/link";
import { HeroMesh } from "@/components/animation/hero-mesh";
import { ColorCycleFrame } from "@/components/animation/color-cycle-frame";

export function Hero() {
  return (
    <section className="mt-[var(--nav-height)] grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-var(--nav-height))] h-[calc(100dvh-var(--nav-height))] border-b-4 border-foreground overflow-hidden">
      {/* Left — Black panel */}
      <div className="bg-foreground dark:bg-[var(--sf-darker-surface)] text-background dark:text-foreground pr-[clamp(16px,4vw,48px)] pl-[calc(clamp(16px,4vw,48px)-2em)] py-[clamp(16px,3vh,60px)] flex flex-col justify-center relative overflow-hidden">
        {/* Canvas mesh background — opacity-0 initial state; GSAP fades to 0.45 via data-anim="hero-mesh" */}
        <div data-anim="hero-mesh" className="absolute inset-0 z-0 opacity-0">
          <HeroMesh className="w-full h-full" />
        </div>

        {/* Halftone decorative circle */}
        <div
          className="absolute -top-20 -right-20 w-[min(400px,50vw)] h-[min(400px,50vw)] opacity-[0.15]"
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
          className="absolute bottom-[clamp(8px,2vh,40px)] left-[clamp(16px,4vw,48px)] w-[min(200px,30vw)] h-[3px] bg-primary z-[var(--z-content)]"
          aria-hidden="true"
        />

        {/* Title: SIGNAL//FRAME */}
        <div className="relative z-[var(--z-content)]">
          <h1
            data-anim="hero-title"
            aria-label="SignalframeUX"
            suppressHydrationWarning
            className="sf-display text-[clamp(58px,16.8vw,437px)] leading-[0.7] tracking-[-0.03em] text-white uppercase origin-top-left"
            style={{
              textShadow: "0 1px 0 var(--sf-text-shadow-light), 0 -1px 0 var(--sf-text-shadow-dark)",
              transform: "scale(1.176)",
            }}
          >
            <ColorCycleFrame className="inline-block text-white">
              <span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">S</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">I</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">G</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">N</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">A</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">L</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">F</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">R</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">A</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">M</span></span><span className="inline-block overflow-hidden"><span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">E</span></span>
            </ColorCycleFrame>
            <span className="block text-white text-[clamp(48px,13.8vw,374px)] -mt-[0.05em] ml-[0.10em] relative z-10 leading-[0.92]">
              <span className="inline-block overflow-visible border-l-[3px] border-solid border-white box-border pl-[0.06em]">
                <span
                  aria-hidden="true"
                  data-anim="hero-slashes"
                  className="inline-block align-baseline text-[1.28em] text-white leading-none"
                >
                  {"//"}
                </span>
                <span className="inline-block overflow-hidden align-baseline">
                  <span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">
                    U
                  </span>
                </span>
                <span className="inline-block overflow-hidden align-baseline">
                  <span suppressHydrationWarning aria-hidden="true" data-anim="hero-char" className="inline-block">
                    X
                  </span>
                </span>
              </span>
            </span>
          </h1>
        </div>

        {/* Multilingual text */}
        <div className="relative z-[var(--z-content)] mt-[calc(clamp(4px,1vh,12px)+60px)] ml-[1.5em] sf-jfm-flicker">
          <p lang="ja" data-anim="hero-katakana" data-text="シグナルフレーム™" className="sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(5.8px,0.77vw,11.5px)] font-bold">
            シグナルフレーム™
          </p>
          <p
            lang="fa"
            data-anim="hero-farsi"
            data-text="سیگنال‌فریم™"
            className="sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(11px,1.38vw,16.6px)] font-black -mt-[2px]"
            dir="rtl"
            style={{ textAlign: "left" }}
          >
            سیگنال‌فریم™
          </p>
          <p lang="zh" data-anim="hero-mandarin" data-text="信号框架™" className="sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(4.6px,0.62vw,9.2px)] font-black mt-[clamp(2px,0.5vh,8px)]">
            信号框架™
          </p>
        </div>

        {/* Subtitle */}
        <p data-anim="hero-subtitle" className="sf-hero-deferred mt-[0.35em] ml-[calc(1.5em+4px)] text-[var(--sf-dim-text)] dark:text-muted-foreground uppercase tracking-[0.2em] text-[clamp(8px,1vw,13px)] max-w-[clamp(260px,29.167vw,420px)] relative z-[var(--z-content)]">
          <span className="whitespace-nowrap">DETERMINISTIC INTERFACE. GENERATIVE EXPRESSION.</span><br />
          <span className="whitespace-nowrap">UNIVERSAL DESIGN SYSTEM BY CULTURE DIVISION</span>
        </p>
      </div>

      {/* Right — White panel */}
      <div className="bg-background px-[clamp(16px,4vw,48px)] py-[clamp(16px,3vh,60px)] flex flex-col justify-center relative" style={{ paddingBottom: "calc(clamp(16px,3vh,60px) + 4.5em)" }}>
        {/* Manifesto */}
        <p className="text-[clamp(16px,2.8vw,36.4px)] leading-[1.4] font-bold text-foreground max-w-[clamp(320px,36.111vw,520px)]">
          <span data-anim="hero-copy" style={{ opacity: 0 }}>a system you can </span><span data-anim="hero-feel" className="text-primary relative z-[5000]" style={{ opacity: 0, filter: "blur(20px)" }}>feel</span><span data-anim="hero-copy-dot" style={{ opacity: 0 }}>.</span>
        </p>

        {/* Component count — honest claim, DU/TDR typographic voice */}
        <p className="mt-[var(--sfx-space-4)] text-[clamp(9px,0.8vw,12px)] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          48 SF COMPONENTS
        </p>

        {/* CTAs with border-draw animation */}
        <div className="flex gap-[clamp(8px,1.5vw,16px)] mt-[clamp(16px,3vh,40px)]">
          <Link
            href="/init"
            data-anim="cta-btn"
            className="hero-cta-btn primary relative inline-block no-underline bg-foreground text-background px-[clamp(16px,2vw,28px)] py-[clamp(8px,1.2vh,14px)] text-[clamp(9px,0.8vw,12px)] font-bold uppercase tracking-[0.15em] border-2 border-foreground overflow-hidden"
          >
            GET STARTED
            <span className="bd-span" aria-hidden="true" />
          </Link>
          <a
            href="https://github.com/signalframeux"
            target="_blank"
            rel="noopener noreferrer"
            data-anim="cta-btn"
            className="hero-cta-btn secondary relative inline-block no-underline bg-transparent text-foreground px-[clamp(16px,2vw,28px)] py-[clamp(8px,1.2vh,14px)] text-[clamp(9px,0.8vw,12px)] font-bold uppercase tracking-[0.15em] border-2 border-foreground overflow-hidden"
          >
            VIEW ON GITHUB
            <span className="sr-only">(opens in new tab)</span>
            <span className="bd-span" aria-hidden="true" />
          </a>
        </div>

        {/* Version tag */}
        <div className="absolute bottom-[clamp(8px,1.5vh,24px)] right-[clamp(8px,1.5vw,24px)] text-[clamp(7px,0.7vw,10px)] uppercase tracking-[0.2em] text-muted-foreground">
          SF//UX v1.7 · 2026
        </div>
      </div>

    </section>
  );
}
