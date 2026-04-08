"use client";

import { GLSLHeroLazy } from "@/components/animation/glsl-hero-lazy";

export function EntrySection() {
  return (
    <div className="relative h-screen w-full overflow-hidden" data-entry-section>
      {/* WebGL background — absolute inset-0, z-0 */}
      <GLSLHeroLazy />

      {/* HTML overlay — LCP target */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1
          data-anim="hero-title"
          className="font-display text-center text-primary-foreground uppercase tracking-[0.02em] leading-[0.9]"
          style={{
            fontSize: "clamp(7.5rem, 12vw, 10rem)",
            fontWeight: 700,
            opacity: 0.01,
          }}
        >
          SIGNALFRAME<span className="text-primary">{"//"}</span>UX
        </h1>
        <p
          data-anim="hero-subtitle"
          className="mt-4 text-muted-foreground text-center font-sans text-base tracking-[var(--sf-tracking-label)]"
          style={{ opacity: 0 }}
        >
          A dual-layer design system for generative expression.
        </p>
      </div>
    </div>
  );
}
