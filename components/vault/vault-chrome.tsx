"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface VaultChromeProps {
  code?: string;
  mode?: string;
  timestamp?: string;
  geoCoord?: string;
  reticle?: boolean;
  waveform?: boolean;
  rangeFinder?: boolean;
  brackets?: boolean;
  ticks?: boolean;
  className?: string;
}

/*
 * Full Cyber2k HUD scaffold — NOT just 4-corner labels. This primitive
 * is the peer-group's diegetic-instrument register:
 *
 *   - Corner L-brackets (not just labels)
 *   - Rail ticks along all four edges (frame/ruler feel)
 *   - Center crosshair reticle with concentric rings
 *   - Range-finder bracket pair on the right rail
 *   - Live waveform at the bottom rail (animated sine+noise)
 *   - 8 text slots distributed around the frame for coded labels
 *
 * All elements opt-in. Defaults render a medium-dense HUD. For
 * maximum density pass all flags true; for a minimal chrome pass
 * only `code` + `mode`.
 */

function Brackets() {
  const s = "stroke-[var(--vault-chrome-strong)] fill-none stroke-[1.5]";
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full z-10"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* TL */}
      <polyline points="1,8 1,1 8,1" className={s} />
      {/* TR */}
      <polyline points="92,1 99,1 99,8" className={s} />
      {/* BL */}
      <polyline points="1,92 1,99 8,99" className={s} />
      {/* BR */}
      <polyline points="92,99 99,99 99,92" className={s} />
    </svg>
  );
}

function Ticks() {
  const ticks = Array.from({ length: 24 });
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
    >
      {/* top rail */}
      <div className="absolute top-0 left-0 right-0 h-6 flex items-start">
        {ticks.map((_, i) => (
          <div
            key={`t${i}`}
            className="flex-1 border-l border-[var(--vault-chrome-soft)] first:border-l-0"
            style={{
              height: i % 4 === 0 ? 10 : i % 2 === 0 ? 6 : 3,
            }}
          />
        ))}
      </div>
      {/* bottom rail */}
      <div className="absolute bottom-0 left-0 right-0 h-6 flex items-end">
        {ticks.map((_, i) => (
          <div
            key={`b${i}`}
            className="flex-1 border-l border-[var(--vault-chrome-soft)] first:border-l-0"
            style={{
              height: i % 4 === 0 ? 10 : i % 2 === 0 ? 6 : 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Reticle() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] z-10 opacity-45 stroke-[var(--cdb-paper)] fill-none stroke-[1]"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="40" />
      <circle cx="50" cy="50" r="22" />
      <circle cx="50" cy="50" r="3" fill="var(--cdb-lime)" stroke="none" />
      <line x1="0" y1="50" x2="36" y2="50" />
      <line x1="64" y1="50" x2="100" y2="50" />
      <line x1="50" y1="0" x2="50" y2="36" />
      <line x1="50" y1="64" x2="50" y2="100" />
    </svg>
  );
}

function RangeFinder() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10 opacity-60"
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--cdb-paper)]">
        RNG
      </div>
      <svg viewBox="0 0 20 60" className="w-5 h-24 stroke-[var(--cdb-paper)] fill-none stroke-[1]">
        <line x1="10" y1="4" x2="10" y2="56" />
        <polyline points="4,8 10,4 16,8" />
        <polyline points="4,52 10,56 16,52" />
        <line x1="6" y1="20" x2="14" y2="20" />
        <line x1="6" y1="30" x2="14" y2="30" stroke="var(--cdb-lime)" />
        <line x1="6" y1="40" x2="14" y2="40" />
      </svg>
      <div className="font-mono text-[9px] text-[var(--cdb-lime)]">1.412</div>
    </div>
  );
}

function Waveform() {
  const [offset, setOffset] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      setOffset((o) => (o + 0.8) % 200);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const points = React.useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < 200; i++) {
      const x = i;
      const y =
        10 +
        Math.sin((i + offset) * 0.18) * 4 +
        Math.sin((i + offset) * 0.07) * 2.5 +
        (Math.random() - 0.5) * 1.2;
      out.push(`${x},${y}`);
    }
    return out.join(" ");
  }, [offset]);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-10 right-10 bottom-10 z-10 opacity-70"
    >
      <svg
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        className="w-full h-6 stroke-[var(--cdb-lime)] fill-none stroke-[0.6]"
      >
        <polyline points={points} />
      </svg>
    </div>
  );
}

export function VaultChrome({
  code = "SF//VLT-000",
  mode = "READOUT / FRAME",
  timestamp = "2026.04.18 / 22:19:52 / TS+0000",
  geoCoord = "-33.9249°S · 18.4241°E",
  reticle = true,
  waveform = true,
  rangeFinder = true,
  brackets = true,
  ticks = true,
  className,
}: VaultChromeProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[var(--z-hud,50)]",
        className
      )}
    >
      {brackets && <Brackets />}
      {ticks && <Ticks />}
      {reticle && <Reticle />}
      {rangeFinder && <RangeFinder />}
      {waveform && <Waveform />}
      {/* text slots */}
      <div className="pointer-events-none absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/85">
        <div className="text-[var(--cdb-lime)]">{`// ${mode}`}</div>
        <div className="mt-1">{code}</div>
      </div>
      <div className="pointer-events-none absolute top-4 right-4 sm:top-6 sm:right-6 text-right font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/85">
        <div>{timestamp}</div>
        <div className="mt-1 text-[var(--cdb-paper)]/55">SYS.OK / VSYNC 60Hz</div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-6 sm:left-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/85">
        <div>CULTURE DIVISION</div>
        <div className="mt-1 text-[var(--cdb-paper)]/55">{geoCoord}</div>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-right font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/85">
        <div className="text-[var(--vault-orange)]">SIGNAL 0.812</div>
        <div className="mt-1 text-[var(--cdb-paper)]/55">FRAME 00:00:14:22</div>
      </div>
    </div>
  );
}
