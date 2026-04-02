import type { Metadata } from "next";
import { Electrolize, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { GlobalEffectsLazy } from "@/components/layout/global-effects-lazy";
import { LenisProvider } from "@/components/layout/lenis-provider";
import { PageAnimations } from "@/components/layout/page-animations";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const anton = localFont({
  src: "./fonts/Anton-Regular.woff2",
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
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
  return (
    <html
      lang="en"
      className={`${electrolize.variable} ${anton.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var t=localStorage.getItem('sf-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <noscript>
          <style>{`.sf-hero-deferred, .sf-anim-hidden, [data-anim="section-reveal"], [data-anim="tag"], [data-anim="comp-cell"], [data-anim="cta-btn"] { opacity: 1 !important; transform: none !important; }`}</style>
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
            {children}
          </LenisProvider>
        </TooltipProvider>
        <GlobalEffectsLazy />
        <PageAnimations />
      </body>
    </html>
  );
}
