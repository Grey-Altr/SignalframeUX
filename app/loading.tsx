export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-live="polite">
      <div className="text-center">
        <div
          className="sf-display text-[clamp(32px,5vw,48px)] text-foreground mb-4"
        >
          SF<span className="text-primary">//</span>UX
        </div>
        <div className="w-48 h-[2px] bg-muted mx-auto overflow-hidden">
          <div
            className="h-full bg-primary sf-skeleton"
            style={{
              width: "30%",
            }}
          />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          LOADING SIGNAL...
        </p>
      </div>
    </div>
  );
}
