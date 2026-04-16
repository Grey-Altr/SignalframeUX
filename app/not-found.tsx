import Link from "next/link";
import { SFContainer } from "@/components/sf";
import { SFText } from "@/components/sf";
import { SFButton } from "@/components/sf";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center bg-background px-[var(--sfx-space-6)]"
    >
      <SFContainer>
        <div className="text-center">
          <h1 className="sr-only">404 — Page Not Found</h1>
          <div
            data-anim="page-heading"
            aria-hidden="true"
            className="sf-display text-[clamp(64px,calc(12*var(--sf-vw)),120px)] text-foreground leading-none mb-[var(--sfx-space-4)]"
            suppressHydrationWarning
          >
            4<span className="text-primary">0</span>4
          </div>
          <SFText
            variant="body"
            as="p"
            className="uppercase tracking-[0.1em] text-muted-foreground mb-[var(--sfx-space-8)]"
          >
            SIGNAL NOT FOUND. THE REQUESTED ROUTE DOES NOT EXIST.
          </SFText>
          <SFButton asChild intent="signal">
            <Link href="/">RETURN TO BASE</Link>
          </SFButton>
        </div>
      </SFContainer>
    </main>
  );
}
