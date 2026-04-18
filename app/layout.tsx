import type { Metadata } from "next";
import { JetBrains_Mono, Bungee, Archivo_Narrow } from "next/font/google";
import "./globals.css";

/*
 * Branch: aesthetic-deep-dive
 * Layout gutted to pure cdB grammar: no Nav, no InstrumentHUD, no ScaleCanvas,
 * no Lenis, no SignalCanvas, no PageAnimations. Other routes (/init,
 * /inventory, /system, etc.) will render against this bare layout and may
 * look broken on this branch — that is the intentional cost of a pure
 * aesthetic reset. main branch is untouched.
 */

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Bungee — David Jonathan Ross. Maximalist wide display face,
// peer-group territory (NCL Graxebeosa / DEN® extreme-horizontal register).
const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bungee",
  display: "swap",
});

// Archivo Narrow — condensed grotesque. Carries the Segapunk / poster-type
// vertical-compression register without being as extreme as Anton.
const archivoNarrow = Archivo_Narrow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-archivo-narrow",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://signalframe.culturedivision.com"),
  title: "SIGNALFRAME//UX — cdB",
  description:
    "Culture Division design system — cdB aesthetic deep-dive build.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${bungee.variable} ${archivoNarrow.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased overflow-x-hidden bg-[var(--cdb-black)] text-[var(--cdb-paper)] font-[var(--font-jetbrains)]">
        {children}
      </body>
    </html>
  );
}
