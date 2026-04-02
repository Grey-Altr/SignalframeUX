"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <div
          className="sf-display text-[clamp(48px,8vw,80px)] text-destructive mb-2"
        >
          ERROR
        </div>
        <p className="text-[13px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
          {error.message || "AN UNEXPECTED ERROR OCCURRED"}
        </p>
        <button
          onClick={reset}
          className="border-2 border-foreground bg-foreground text-background px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          TRY AGAIN
        </button>
      </div>
    </main>
  );
}
