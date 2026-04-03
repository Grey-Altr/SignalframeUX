"use client";

import { SFButton } from "@/components/sf/sf-button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-background px-6">
      <div role="alert" className="text-center max-w-md">
        <h1 className="sr-only">Error</h1>
        <div
          aria-hidden="true"
          className="sf-display text-[clamp(48px,8vw,80px)] text-destructive mb-2"
        >
          ERROR
        </div>
        <p className="text-[var(--text-base)] uppercase tracking-[0.1em] text-muted-foreground mb-6">
          AN UNEXPECTED ERROR OCCURRED
        </p>
        {error.digest && (
          <p className="text-[var(--text-xs)] font-mono uppercase tracking-wider text-muted-foreground mb-4">
            DIGEST: {error.digest}
          </p>
        )}
        <SFButton intent="signal" onClick={reset}>
          TRY AGAIN
        </SFButton>
      </div>
    </main>
  );
}
