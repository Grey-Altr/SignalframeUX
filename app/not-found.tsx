import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <div
          className="sf-display text-[clamp(64px,12vw,120px)] text-foreground leading-none mb-2"
        >
          4<span className="text-primary">0</span>4
        </div>
        <p className="text-[13px] uppercase tracking-[0.1em] text-muted-foreground mb-8">
          SIGNAL NOT FOUND. THE REQUESTED ROUTE DOES NOT EXIST.
        </p>
        <Link
          href="/"
          className="inline-block border-2 border-foreground bg-foreground text-background px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] no-underline hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}
