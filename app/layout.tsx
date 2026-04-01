import type { Metadata } from "next";
import { Electrolize } from "next/font/google";
import localFont from "next/font/local";
import { GlobalEffects } from "@/components/layout/global-effects";
import { LenisProvider } from "@/components/layout/lenis-provider";
import "./globals.css";

const electrolize = Electrolize({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-electrolize",
});

const anton = localFont({
  src: "./fonts/Anton-Regular.ttf",
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIGNALFRAME//UX",
  description:
    "Universal design system combining clarity (Signal) and generative depth (Field). Built for product design engineers.",
  keywords: [
    "design system",
    "component library",
    "React",
    "TypeScript",
    "shadcn",
    "GSAP",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${electrolize.variable} ${anton.variable}`}
    >
      <body className="antialiased overflow-x-hidden">
        <LenisProvider>
          {children}
        </LenisProvider>
        <GlobalEffects />
      </body>
    </html>
  );
}
