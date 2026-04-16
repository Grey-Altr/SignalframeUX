"use client";

import { useEffect } from "react";
import { SFContainer } from "@/components/sf";
import { SFText } from "@/components/sf";
import { SFButton } from "@/components/sf";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Guard: skip ScrambleText on reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = document.querySelector("[data-anim='error-code']");
    if (!el) return;

    import("@/lib/gsap-plugins").then(({ gsap }) => {
      gsap.to(el, {
        duration: 0.6,
        scrambleText: {
          text: "ERROR",
          chars: "01!<>-_\\/[]{}—=+*^?#",
          speed: 0.5,
        },
      });
    });
  }, []);

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center bg-background px-[var(--sfx-space-6)]"
    >
      <SFContainer>
        <div role="alert" className="text-center">
          <h1 className="sr-only">Error</h1>
          <div
            data-anim="error-code"
            aria-hidden="true"
            className="sf-display sf-glitch text-[clamp(48px,calc(8*var(--sf-vw)),80px)] text-destructive mb-[var(--sfx-space-4)]"
          >
            ERROR
          </div>
          <SFText
            variant="body"
            as="p"
            className="uppercase tracking-[0.1em] text-muted-foreground mb-[var(--sfx-space-6)]"
          >
            AN UNEXPECTED ERROR OCCURRED
          </SFText>
          {error.digest && (
            <SFText
              variant="small"
              as="span"
              className="block font-mono uppercase tracking-wider text-muted-foreground mb-[var(--sfx-space-8)]"
            >
              DIGEST: {error.digest}
            </SFText>
          )}
          <SFButton intent="signal" onClick={reset}>
            TRY AGAIN
          </SFButton>
        </div>
      </SFContainer>
    </main>
  );
}
