import type { Metadata } from "next";
import { Electrolize, JetBrains_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import { GlobalEffectsLazy } from "@/components/layout/global-effects-lazy";
import { SignalCanvasLazy } from "@/components/layout/signal-canvas-lazy";
import { LenisProvider } from "@/components/layout/lenis-provider";
import { Nav } from "@/components/layout/nav";
import { ScaleCanvas } from "@/components/layout/scale-canvas";
import { PageAnimations } from "@/components/layout/page-animations";
import { PageTransition } from "@/components/animation/page-transition";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SignalframeProvider } from "@/components/layout/signalframe-config";
import { SFToaster } from "@/components/sf";
import { InstrumentHUD } from "@/components/layout/instrument-hud";
import { BorderlessProvider } from "@/components/providers/theme-provider";
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
  display: "optional",
  // CLS fix (Wave 3 T-01/T-02): "optional" prevents font-swap layout shift.
  // Anton is a display-only font (headings/hero). "optional" means the browser
  // renders with the fallback if Anton isn't cached; on repeat visits (Awwwards
  // evaluator) Anton loads from cache with zero CLS. "swap" was causing 0.485
  // CLS on /system because the clamp(80px, 12vw, 160px) heading shifts on swap.
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
  const scaleScript = `(function(){try{var vw=window.innerWidth,vh=window.innerHeight,DW=1280,SHRINK=435,IDLE=800;var s=vw/DW,hs=Math.min(1,vh/SHRINK),cs=Math.min(s,hs),ns=hs;var m=Math.max(0,Math.min(1,(IDLE-vh)/(IDLE-SHRINK)));var r=document.documentElement.style;r.setProperty('--sf-content-scale',String(s));r.setProperty('--sf-canvas-scale',String(cs));r.setProperty('--sf-nav-scale',String(ns));r.setProperty('--sf-nav-morph',String(m));r.setProperty('--sf-hero-shift','0px');r.setProperty('--sf-frame-offset-x','0px');r.setProperty('--sf-frame-bottom-gap','0px')}catch(e){}})()`;

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
        <div className="sf-mesh-gradient" aria-hidden="true" />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[var(--z-skip)] focus:bg-primary focus:text-primary-foreground focus:px-[var(--sfx-space-6)] focus:py-[var(--sfx-space-3)] focus:text-sm focus:font-bold focus:uppercase focus:tracking-wider"
        >
          Skip to content
        </a>
        <TooltipProvider>
          <LenisProvider>
            <SignalframeProvider>
              <BorderlessProvider>
              <ScaleCanvas>{children}</ScaleCanvas>
              <Nav />
            </BorderlessProvider>
            </SignalframeProvider>
          </LenisProvider>
        </TooltipProvider>
        <SFToaster />
        <GlobalEffectsLazy />
        <SignalCanvasLazy />
        <PageAnimations />
        <PageTransition />
        <InstrumentHUD />
      </body>
    </html>
  );
}
