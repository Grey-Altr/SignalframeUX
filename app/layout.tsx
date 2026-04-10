import type { Metadata } from "next";
import { headers } from "next/headers";
import { Electrolize, JetBrains_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import { GlobalEffectsLazy } from "@/components/layout/global-effects-lazy";
import { SignalCanvasLazy } from "@/components/layout/signal-canvas-lazy";
import { LenisProvider } from "@/components/layout/lenis-provider";
import { PageAnimations } from "@/components/layout/page-animations";
import { PageTransition } from "@/components/animation/page-transition";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SignalframeProvider } from "@/components/layout/signalframe-config";
import { SFToaster } from "@/components/sf";
import { InstrumentHUD } from "@/components/layout/instrument-hud";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  // Static string literal for theme detection — no user input interpolated, safe from XSS.
  const themeScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('sf-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}}catch(e){}})()`;

  return (
    <html
      lang="en"
      className={`${electrolize.variable} ${inter.variable} ${anton.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking theme script — prevents FOUC. CSP nonce injected from middleware. */}
        {/* suppressHydrationWarning: browsers strip nonce from DOM after parsing (security feature),
            so server="nonce-xxx" but client="" — this is expected, not a real mismatch. */}
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{`.sf-hero-deferred, .sf-anim-hidden, .sf-motion-hidden, [data-anim="section-reveal"], [data-anim="tag"], [data-anim="comp-cell"], [data-anim="cta-btn"], [data-anim="manifesto-word"], [data-anim="hero-mesh"], [data-anim="error-code"], [data-anim="ghost-label"], [data-anim="stagger"] > * { opacity: 1 !important; visibility: visible !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="antialiased overflow-x-hidden">
<a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[var(--z-skip)] focus:bg-primary focus:text-primary-foreground focus:px-6 focus:py-3 focus:text-sm focus:font-bold focus:uppercase focus:tracking-wider"
        >
          Skip to content
        </a>
        <TooltipProvider>
          <LenisProvider>
            <SignalframeProvider>
              {children}
            </SignalframeProvider>
          </LenisProvider>
        </TooltipProvider>
        <SFToaster />
        {/* White wipe-up reveal on page load */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 800,
            background: "var(--color-background)",
            transformOrigin: "top",
            animation: "sf-load-wipe-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) 2s both",
            pointerEvents: "none",
          }}
        />
        <GlobalEffectsLazy />
        <SignalCanvasLazy />
        <PageAnimations />
        <PageTransition />
        <InstrumentHUD />
      </body>
    </html>
  );
}
