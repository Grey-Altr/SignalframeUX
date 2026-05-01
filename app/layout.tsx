import type { Metadata } from "next";
import { Electrolize, JetBrains_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import { GlobalEffectsLazy } from "@/components/layout/global-effects-lazy";
import { SignalCanvasLazy } from "@/components/layout/signal-canvas-lazy";
import { LenisProvider } from "@/components/layout/lenis-provider";
import { FrameNavigation } from "@/components/layout/frame-navigation";
import { PanelHeightAssertion } from "@/components/layout/panel-height-assertion";
import { CheatsheetOverlay } from "@/components/layout/cheatsheet-overlay";
import { Nav } from "@/components/layout/nav";
import { NavRevealMount } from "@/components/layout/nav-reveal-mount";
import { CdCornerPanel } from "@/components/layout/cd-corner-panel";
import { ScaleCanvas } from "@/components/layout/scale-canvas";
import { PageAnimations } from "@/components/layout/page-animations";
import { PageTransition } from "@/components/animation/page-transition";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SignalframeProvider } from "@/components/layout/signalframe-config";
import { SFToasterLazy } from "@/components/sf/sf-toast-lazy";
import { InstrumentHUD } from "@/components/layout/instrument-hud";
import { BorderlessProvider } from "@/components/providers/theme-provider";
import { WebVitals } from "./_components/web-vitals";
import "./globals.css";

const electrolize = Electrolize({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-electrolize",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = localFont({
  src: "./fonts/Anton-Regular.woff2",
  variable: "--font-anton",
  display: "swap",
  // CRT-03 (Phase 59 Plan B): "swap" + tuned descriptors against the
  // Impact / Helvetica Neue Condensed / Arial Black fallback chain.
  // The Wave-3 0.485 CLS regression was caused by the system fallback's
  // metrics being structurally different from Anton (Arial proportional
  // vs Anton condensed-narrow-tall). With descriptors calibrated below
  // (MEASURED via scripts/measure-anton-descriptors.mjs against the
  // subsetted .woff2; cross-verified with Brian Louis Ramirez Fallback
  // Font Generator formula), the swap is invisible at slow-3G. Slow-3G
  // hard-reload screen recording is the verification gate
  // (tests/v1.8-phase59-anton-swap-cls.spec.ts).
  // AES-02 documented exception per AESTHETIC-OF-RECORD.md Change Log.
  // CRT-02: Anton-Regular.woff2 is now subsetted (full printable ASCII + TM,
  // 11.1 KB vs original 58.8 KB, 81% byte reduction).
  adjustFontFallback: false,
  fallback: ["Impact", "Helvetica Neue Condensed", "Arial Black", "sans-serif"],
  declarations: [
    { prop: "size-adjust",       value: "92.14%" },  // MEASURED Task 4
    { prop: "ascent-override",   value: "127.66%" }, // MEASURED Task 4
    { prop: "descent-override",  value: "35.72%" },  // MEASURED Task 4
    { prop: "line-gap-override", value: "0%" },      // display fonts ship line-gap=0
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://signalframe.culturedivision.com"),
  title: "SIGNALFRAME//UX",
  description:
    "Universal design system combining clarity (Signal) and generative depth (Frame). Built for product design engineers.",
  keywords: [
    "design system",
    "component library",
    "React",
    "TypeScript",
    "shadcn",
    "GSAP",
  ],
  openGraph: {
    title: "SIGNALFRAME//UX",
    description: "Deterministic interface. Generative expression. The programmable design system for digital surfaces.",
    type: "website",
    siteName: "SignalframeUX",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIGNALFRAME//UX",
    description: "Deterministic interface. Generative expression. The programmable design system for digital surfaces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Static string literal for theme detection — no user input interpolated, safe from XSS.
  // CSP has 'unsafe-inline' for script-src so nonce is not required for this inline script.
  // Removing headers() here is critical: calling headers() forces dynamic rendering which
  // defers Next.js metadata injection into the body via streaming, breaking SEO (Lighthouse
  // fails meta-description because the tag lands after </head>).
  // Default theme is light; `dark` is applied only when sf-theme === "dark" (explicit user choice).
  const themeScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('sf-theme');if(t==='dark')d.classList.add('dark');var b=localStorage.getItem('sf-borderless');if(b==='true')d.setAttribute('data-borderless','true')}catch(e){}})()`;

  // Pre-hydration scale setup — CLS fix. ScaleCanvas's useEffect runs AFTER first
  // paint; sections inside [data-sf-canvas] use calc(100vh / var(--sf-content-scale, 1))
  // which resolves to 100vh pre-JS, then jumps to 100vh/scale post-JS. That flex-center
  // re-computation shifts every absolutely-positioned hero element (CLS 0.65 @ t=646ms).
  // This blocking script mirrors the initial applyScale() computation so the CSS var is
  // set before first paint and the CSS rule [data-sf-canvas]{transform:scale(var(...))}
  // renders the first frame already scaled. ScaleCanvas's effect keeps running for resize.
  //
  // Phase 66 ARC-02: when vw < 640 (sm breakpoint, BP=640), all scale vars are
  // pinned to 1 and nav-morph to 0, mirroring components/layout/scale-canvas.tsx
  // applyScale() pillarbox branch (BREAKPOINT_PX=640). CLS=0 contract preserved
  // by exact parity — Pitfall 1 of 66-RESEARCH.md.
  const scaleScript = `(function(){try{var vw=window.innerWidth,vh=window.innerHeight,DW=1280,SHRINK=435,IDLE=800,BP=640;var s,hs,cs,ns,m;if(vw<BP){s=1;hs=1;cs=1;ns=1;m=0}else{s=vw/DW;hs=Math.min(1,vh/SHRINK);cs=Math.min(s,hs);ns=hs;m=Math.max(0,Math.min(1,(IDLE-vh)/(IDLE-SHRINK)))}var r=document.documentElement.style;r.setProperty('--sf-content-scale',String(s));r.setProperty('--sf-canvas-scale',String(cs));r.setProperty('--sf-nav-scale',String(ns));r.setProperty('--sf-nav-morph',String(m));r.setProperty('--sf-hero-shift','0px');r.setProperty('--sf-frame-offset-x','0px');r.setProperty('--sf-frame-bottom-gap','0px')}catch(e){}})()`;

  // Pre-paint canvas-height sync — inlined from public static file per CRT-01 Phase 59.
  // Mirrors the legacy external IIFE: query [data-sf-canvas], read inner
  // offsetHeight, multiply by vw/1280 (--sf-content-scale floor), set on outer
  // parent. Inline so it runs at HTML parse time, after [data-sf-canvas] is in
  // the DOM via React's streamed body. Mounted in <body> tail (NOT <head>) so
  // the [data-sf-canvas] div is already streamed by React when the script runs.
  // Pitfall #2/#8: do NOT migrate to next/script strategy="beforeInteractive"
  // (runs after first paint, reintroduces 0.485 CLS). Static literal, no user
  // input interpolated — XSS-impossible by construction.
  //
  // Phase 66 ARC-02: same vw<640 branch as scaleScript — when scale=1 below
  // sm, outer.height = inner.offsetHeight * 1 (no scaling), matching the
  // applyScale() pillarbox branch. Without this branch, when --sf-content-scale=1
  // below sm but this script writes outer.height = inner.offsetHeight * (vw/1280),
  // outer collapses to 28% of inner while inner renders full-size — massive
  // scroll-overflow at first paint (Open Question 1 of decision-doc).
  const canvasSyncScript = `(function(){try{var i=document.querySelector('[data-sf-canvas]');if(!i)return;var o=i.parentElement;if(!o)return;var vw=window.innerWidth,BP=640;var s=vw<BP?1:vw/1280;o.style.height=(i.offsetHeight*s)+'px';}catch(e){}})()`;

  return (
    <html
      lang="en"
      className={`${electrolize.variable} ${inter.variable} ${anton.variable} ${jetbrainsMono.variable}`}
      data-borderless="true"
      suppressHydrationWarning
    >
      <head>
        {/* Blocking theme script — prevents FOUC. Static literal, no user input. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Blocking scale script — CLS fix. Static literal, no user input. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: scaleScript }} />
        <noscript>
          <style>{`.sf-hero-deferred, .sf-anim-hidden, .sf-motion-hidden, [data-anim="section-reveal"], [data-anim="tag"], [data-anim="comp-cell"], [data-anim="cta-btn"], [data-anim="manifesto-word"], [data-anim="hero-mesh"], [data-anim="error-code"], [data-anim="ghost-label"], [data-anim="stagger"] > * { opacity: 1 !important; visibility: visible !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="antialiased overflow-x-hidden" data-nav-layout="vertical">
        <WebVitals />
        <div className="sf-mesh-gradient" aria-hidden="true" />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[var(--z-skip)] focus:bg-primary focus:text-primary-foreground focus:px-[var(--sfx-space-6)] focus:py-[var(--sfx-space-3)] focus:text-sm focus:font-bold focus:uppercase focus:tracking-wider"
        >
          Skip to content
        </a>
        {/* Phase 63.1 Plan 03 Task 1 — LCP fast-path: CdCornerPanel hoisted out of
            the client-provider tree (TooltipProvider → LenisProvider → SignalframeProvider
            → BorderlessProvider) to be a direct <body> child BEFORE any client provider
            opens. Rationale: cd-corner-panel.tsx is a pure Server Component (zero
            'use client', zero hooks, zero state); it was previously inside the hydration
            tree, which made Chrome's LCP detector wait for ~700 ms of blocking JS parse
            before scoring its paint (synthesis §2 finding 2; commit 26f5bca). Hoisting
            to outside the hydration boundary paints the wordmark at HTML-parse time,
            before blocking JS resolves.
            - Z-stacking preserved: z-[var(--sfx-z-nav,40)] composes with <Nav /> whether
              they are siblings under different providers or both <body> children.
            - dark class scope preserved: themeScript writes to <html>; ancestor unchanged.
            - --sf-frame-bottom-gap / --sf-frame-offset-x preserved: scaleScript writes to
              <html>.style; cascades to all descendants regardless of mount position.
            - var(--sfx-cube-fill) binding preserved (CSS custom property; theme-hue cube fill).
            - SVG mask kana-knockout preserved verbatim (component file is unchanged).
            - D-12 trademark fidelity gate: tests/v1.8-phase63-1-wordmark-hoist.spec.ts
              verifies <0.1% pixel diff on [data-cd-corner-panel] across 4 viewports.
            - Candidate A (Server Component carve-out) per RESEARCH §Plan 03 trade-off
              matrix; Candidate B (SVG-as-static-asset) rejected — D-12 BLOCK (loses
              var(--sfx-cube-fill) binding + kana mask see-through); Candidate C
              (pre-hydration inline-SVG injection) reserved as escalation fallback only.
        */}
        <CdCornerPanel />
        <TooltipProvider>
          <LenisProvider>
            <FrameNavigation />
            <PanelHeightAssertion />
            <CheatsheetOverlay />
            <SignalframeProvider>
              <BorderlessProvider>
              <ScaleCanvas>{children}</ScaleCanvas>
              <Nav />
              {/* Nav reveal (audit #13): resolves first matching trigger on the page.
                  Homepage uses [data-entry-section]; subpages use [data-nav-reveal-trigger].
                  On no-match, useNavReveal falls back to nav-visible (safe default). */}
              <NavRevealMount targetSelector="[data-entry-section], [data-nav-reveal-trigger]" />
              {/* CdCornerPanel removed from this position — hoisted to direct <body>
                  child above TooltipProvider. See Phase 63.1 Plan 03 Task 1 comment. */}
            </BorderlessProvider>
            </SignalframeProvider>
          </LenisProvider>
        </TooltipProvider>
        <SFToasterLazy />
        <GlobalEffectsLazy />
        <SignalCanvasLazy />
        <PageAnimations />
        <PageTransition />
        <InstrumentHUD />
        {/* Pre-paint canvas-height sync (CRT-01). Body-tail placement: [data-sf-canvas]
            must already be streamed by React at this point. Same dangerouslySetInnerHTML
            pattern as themeScript + scaleScript above — static literal, no user input,
            XSS-impossible by construction. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: canvasSyncScript }} />
      </body>
    </html>
  );
}
