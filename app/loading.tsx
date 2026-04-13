import { LogoDraw } from "@/components/animation/logo-draw";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-live="polite">
      <div className="text-center">
        <LogoDraw className="w-[200px] h-auto mx-auto text-foreground mb-[var(--sfx-space-6)]" />
        <div className="w-48 h-[2px] bg-muted mx-auto overflow-hidden" role="progressbar" aria-label="Loading">
          <div
            className="h-full bg-primary sf-skeleton"
            style={{ width: "30%" }}
          />
        </div>
        <p className="mt-[var(--sfx-space-4)] text-sm uppercase tracking-[0.2em] text-muted-foreground">
          LOADING SIGNAL...
        </p>
      </div>
    </div>
  );
}
