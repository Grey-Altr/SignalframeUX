import Link from "next/link";
import { SFButton } from "@/components/sf/sf-button";

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="sr-only">404 — Page Not Found</h1>
        <div
          aria-hidden="true"
          className="sf-display text-[clamp(64px,12vw,120px)] text-foreground leading-none mb-2"
        >
          4<span className="text-primary">0</span>4
        </div>
        <p className="text-[var(--text-base)] uppercase tracking-[0.1em] text-muted-foreground mb-8">
          SIGNAL NOT FOUND. THE REQUESTED ROUTE DOES NOT EXIST.
        </p>
        <SFButton asChild intent="signal">
          <Link href="/">RETURN TO BASE</Link>
        </SFButton>
      </div>
    </main>
  );
}
