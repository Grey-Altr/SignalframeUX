"use client";

import { useEffect, useState, useRef, useCallback, useMemo, memo, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/layout/command-palette";
import { NavOverlay } from "@/components/layout/nav-overlay";
import { toggleTheme as sharedToggleTheme } from "@/lib/theme";
import { Magnetic } from "@/components/animation/magnetic";

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

/**
 * Shared scramble coordinator — single RAF loop drives all registered scramble instances.
 * Eliminates 6 concurrent setIntervals (one per NavLink + DarkModeToggle).
 */
type ScrambleEntry = {
  target: string;
  delay: number;
  duration: number;
  settled: Set<number>;
  startTime: number;
  started: boolean;
  done: boolean;
  setText: (s: string) => void;
};

/** Shared state survives HMR via globalThis — prevents orphaned RAF loops during dev reloads */
const SCRAMBLE_KEY = "__sf_scramble" as const;
type ScrambleState = { registry: Map<string, ScrambleEntry>; raf: number; mountTime: number };
function getScrambleState(): ScrambleState {
  const g = globalThis as unknown as Record<string, ScrambleState | undefined>;
  if (!g[SCRAMBLE_KEY]) {
    g[SCRAMBLE_KEY] = { registry: new Map(), raf: 0, mountTime: 0 };
  }
  return g[SCRAMBLE_KEY]!;
}

function scrambleTick() {
  const s = getScrambleState();
  const now = Date.now();
  let allDone = true;

  s.registry.forEach((entry) => {
    if (entry.done) return;
    allDone = false;

    // Wait for staggered delay
    if (!entry.started) {
      if (now - s.mountTime < entry.delay) return;
      entry.started = true;
      entry.startTime = now;
    }

    const elapsed = now - entry.startTime;
    const progress = Math.min(elapsed / entry.duration, 1);
    const chars = entry.target.split("");

    const result = chars.map((c, i) => {
      if (c === " ") return " ";
      const settleAt = (i / chars.length) * 0.7 + 0.3;
      if (progress >= settleAt || entry.settled.has(i)) {
        entry.settled.add(i);
        return c;
      }
      return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
    });

    entry.setText(result.join(""));
    if (entry.settled.size >= chars.filter(c => c !== " ").length) {
      entry.done = true;
    }
  });

  if (!allDone) {
    s.raf = requestAnimationFrame(scrambleTick);
  } else {
    s.raf = 0;
  }
}

function useScrambleText(target: string, delay: number, duration = 600) {
  const [text, setText] = useState(target);
  const reactId = useId();
  const idRef = useRef(reactId);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    const id = idRef.current;
    const s = getScrambleState();

    // Immediately show scrambled state
    setText(target.split("").map((c) =>
      c === " " ? " " : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]
    ).join(""));

    // Register into shared loop
    s.registry.set(id, {
      target, delay, duration,
      settled: new Set<number>(),
      startTime: 0,
      started: false,
      done: false,
      setText,
    });

    // Start shared loop if first registration
    if (s.registry.size === 1) {
      s.mountTime = Date.now();
    }
    if (!s.raf) {
      s.raf = requestAnimationFrame(scrambleTick);
    }

    return () => {
      s.registry.delete(id);
      if (s.registry.size === 0) {
        if (s.raf) {
          cancelAnimationFrame(s.raf);
          s.raf = 0;
        }
        s.mountTime = 0;
      }
    };
  }, [target, delay, duration]);

  return text;
}

const NavLink = memo(function NavLink({ href, label, delay, isActive, ariaLabel, external }: { href: string; label: string; delay: number; isActive: boolean; ariaLabel?: string; external?: boolean }) {
  const text = useScrambleText(label, delay, NAV_LINK_ANIM.duration);
  const linkProps = external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};

  return (
    <Magnetic radius={50} strength={0.12} maxDisplacement={6}>
      <Link
        href={href}
        data-anim="nav-link"
        aria-label={ariaLabel ?? label}
        aria-current={isActive ? "page" : undefined}
        className={`nav-hover-link relative no-underline mr-[clamp(6px,1vw,14px)] inline-block transition-colors duration-300 hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`}
        {...linkProps}
      >
        {text}
        <span className="nav-hover-underline" />
      </Link>
    </Magnetic>
  );
});

const NAV_LINKS: Array<{ href: string; label: string; ariaLabel?: string; external?: boolean }> = [
  { href: "/components", label: "COMPONENTS" },
  { href: "/reference", label: "API" },
  { href: "/tokens", label: "TOKENS" },
  { href: "/start", label: "START", ariaLabel: "Get started with SignalframeUX" },
  { href: "https://github.com/signalframeux", label: "GITHUB", external: true },
];

/** All scramble/animation timing constants in one place */
const CLOCK_ANIM = {
  scrambleFrames: 28,
  scrambleFramesInit: 180,
} as const;

const NAV_LINK_ANIM = {
  baseDelay: 300,
  stagger: 120,
  duration: 500,
} as const;

const LiveClock = memo(function LiveClock() {
  const [display, setDisplay] = useState<string[]>(["—","—",":","—","—",":","—","—"]);
  const prevTimeRef = useRef("");
  const scrambleRef = useRef<Map<number, { frame: number; target: string }>>(
    new Map()
  );
  const rafRef = useRef<number>(0);

  const getTimeString = useCallback(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  useEffect(() => {
    // Skip clock on mobile where it's hidden (sm:block)
    const mql = window.matchMedia("(min-width: 640px)");
    if (!mql.matches) return;

    // Initialize with scramble on load
    const initial = getTimeString();
    prevTimeRef.current = initial;
    // Start all digits scrambling with longer initial duration
    for (let i = 0; i < initial.length; i++) {
      if (initial[i] !== ":") {
        scrambleRef.current.set(i, { frame: -(CLOCK_ANIM.scrambleFramesInit - CLOCK_ANIM.scrambleFrames), target: initial[i] });
      }
    }
    setDisplay(initial.split("").map((c) => (c === ":" ? ":" : String(Math.floor(Math.random() * 10)))));
    startScrambleLoop();

    const interval = setInterval(() => {
      const newTime = getTimeString();
      const oldTime = prevTimeRef.current;

      if (newTime === oldTime) return;

      // Detect which positions changed and start scramble for each
      for (let i = 0; i < newTime.length; i++) {
        if (newTime[i] !== oldTime[i] && newTime[i] !== ":") {
          scrambleRef.current.set(i, { frame: 0, target: newTime[i] });
        }
      }

      prevTimeRef.current = newTime;

      // Start animation loop if not already running
      if (!rafRef.current) {
        startScrambleLoop();
      }
    }, 1000);

    function startScrambleLoop() {
      function tick() {
        const scrambles = scrambleRef.current;
        if (scrambles.size === 0) {
          rafRef.current = 0;
          return;
        }

        const currentTime = prevTimeRef.current;
        const chars = currentTime.split("");

        scrambles.forEach((state, idx) => {
          // For initial scramble (negative frames), progressively slow down
          // by only incrementing on some frames based on progress
          if (state.frame < 0) {
            const progress = 1 - Math.abs(state.frame) / (CLOCK_ANIM.scrambleFramesInit - CLOCK_ANIM.scrambleFrames);
            // Skip more frames as we approach the end (slowing down)
            const skipChance = progress * progress * 0.85;
            if (Math.random() < skipChance) {
              // Don't increment — hold current digit longer
              return;
            }
          }

          state.frame++;
          if (state.frame >= CLOCK_ANIM.scrambleFrames) {
            // Settle on correct digit
            chars[idx] = state.target;
            scrambles.delete(idx);
          } else {
            // Show random digit
            chars[idx] = String(Math.floor(Math.random() * 10));
          }
        });

        setDisplay(chars);
        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    // Pause RAF + interval when tab is hidden, resume on visible
    const intervalRef = { id: interval };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        clearInterval(intervalRef.id);
      } else {
        // Resume interval — clear first to prevent stacking
        clearInterval(intervalRef.id);
        intervalRef.id = setInterval(() => {
          const newTime = getTimeString();
          const oldTime = prevTimeRef.current;
          if (newTime === oldTime) return;
          for (let i = 0; i < newTime.length; i++) {
            if (newTime[i] !== oldTime[i] && newTime[i] !== ":") {
              scrambleRef.current.set(i, { frame: 0, target: newTime[i] });
            }
          }
          prevTimeRef.current = newTime;
          if (!rafRef.current) startScrambleLoop();
        }, 1000);
        if (scrambleRef.current.size > 0) startScrambleLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(intervalRef.id);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [getTimeString]);

  return (
    <span
      role="timer"
      aria-live="off"
      className="sf-display text-[clamp(28px,4vw,48px)] leading-none tracking-tight tabular-nums"
      style={{
        fontVariantNumeric: "tabular-nums",
      }}
      aria-label={`Current time: ${display.join("")}`}
    >
      {display.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`inline-block text-center leading-none ${
            char === ":" ? "w-[0.2em]" : "w-[0.48em]"
          }`}
        >
          {char}
        </span>
      ))}
    </span>
  );
});

const DarkModeToggle = memo(function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [renderPhase, setRenderPhase] = useState(0);
  const lightText = useScrambleText("LIGHT", 600, 400);

  useEffect(() => {
    // Sync state with what the blocking script set
    setDark(document.documentElement.classList.contains("dark"));
    // Graphic render effect: progressively draw the toggle like scan lines
    const phases = [500, 580, 640, 700, 740, 780, 850];
    const timeouts = phases.map((delay, i) =>
      setTimeout(() => setRenderPhase(i + 1), delay)
    );
    // Fallback: ensure toggle is accessible even if animation doesn't complete
    const fallback = setTimeout(() => setRenderPhase(7), 2000);
    return () => { timeouts.forEach(clearTimeout); clearTimeout(fallback); };
  }, []);

  function toggle() {
    setDark((prev) => sharedToggleTheme(prev));
  }

  const renderOpacity = renderPhase === 0 ? 0 : renderPhase < 3 ? 0.15 : renderPhase < 5 ? 0.4 : renderPhase < 7 ? 0.7 : 1;
  const renderFilter = renderPhase < 7 ? `brightness(${1 + (7 - renderPhase) * 0.3})` : "none";

  return (
    <div
      className="flex items-center gap-2.5"
      style={{
        opacity: renderOpacity,
        filter: renderFilter,
        transition: "opacity 0.08s steps(2), filter 0.08s steps(2)",
      }}
    >
      <span className="text-[var(--text-sm)] uppercase tracking-[0.15em] text-muted-foreground" aria-hidden="true">
        {lightText}
      </span>
      <button
        onClick={toggle}
        tabIndex={renderPhase > 0 ? 0 : -1}
        aria-hidden={renderPhase === 0 ? true : undefined}
        className="relative w-[42px] h-[20px] border-2 border-foreground bg-transparent shrink-0 cursor-pointer p-[12px] -m-[12px]"
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={dark}
        style={{
          clipPath: renderPhase < 4 ? `inset(0 0 ${100 - renderPhase * 30}% 0)` : "none",
        }}
      >
        <div
          className="absolute top-[2px] w-3 h-3 bg-foreground transition-all duration-300"
          style={{
            left: dark ? "24px" : "2px",
            backgroundColor: dark ? "var(--color-primary)" : undefined,
            transitionTimingFunction: "cubic-bezier(0.68, -0.2, 0.27, 1.2)",
          }}
        />
      </button>
      <span className="text-[var(--text-sm)] uppercase tracking-[0.15em] text-muted-foreground" aria-hidden="true">
        DARK
      </span>
    </div>
  );
});

const LOGO_TARGET = ["S", "F", "//", "U", "X"];
const ASCII_CHARS = "!@#$%^&*<>{}[]|/\\~`+=_-";
const LOGO_ANIM = {
  scrambleFrames: 40,
  asciiDuration: 800,
  glitchDelay: 300,
} as const;

type LogoPhase = "enter" | "ascii" | "scramble" | "settled" | "flicker" | "done";

const LogoMark = memo(function LogoMark() {
  const [chars, setChars] = useState(LOGO_TARGET);
  const [phase, setPhase] = useState<LogoPhase>("enter");
  const [flickerOn, setFlickerOn] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Respect reduced motion — show final state immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setChars(LOGO_TARGET);
      setPhase("done");
      setFlickerOn(true);
      return;
    }

    // Start scrambled after mount (skip slash position)
    setChars(LOGO_TARGET.map((c, i) => i === 2 ? c : ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]));
    const settled = new Set<number>();
    settled.add(2); // slash doesn't scramble
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Phase 0: Transform in (slide up into viewport)
    const t0 = setTimeout(() => setPhase("ascii"), 400);
    timeouts.push(t0);

    // Phase 1: ASCII cycling (skip slash at index 2)
    const asciiInterval = setInterval(() => {
      setChars((prev) =>
        prev.map((c, i) =>
          i === 2 || settled.has(i) ? LOGO_TARGET[i] : ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        )
      );
    }, 50);

    // Phase 2: Scramble into target
    const t1 = setTimeout(() => {
      setPhase("scramble");
      clearInterval(asciiInterval);
      let scrambleFrame = 0;

      function tick() {
        scrambleFrame++;
        LOGO_TARGET.forEach((_, i) => {
          const settleAt = (i + 1) * (LOGO_ANIM.scrambleFrames / LOGO_TARGET.length);
          if (scrambleFrame >= settleAt) settled.add(i);
        });

        setChars(
          LOGO_TARGET.map((target, i) =>
            settled.has(i) ? target : ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
          )
        );

        if (settled.size < LOGO_TARGET.length) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setPhase("settled");
          // Phase 3: Tube light flicker for //
          const t2 = setTimeout(() => {
            setPhase("flicker");
            // Flicker sequence: on-off-on-off-on-off-ON (tube light warmup)
            const flickers = [80, 60, 100, 50, 80, 40, 0];
            let step = 0;

            function nextFlicker() {
              if (step >= flickers.length) {
                setFlickerOn(true);
                setPhase("done");
                return;
              }
              setFlickerOn((prev) => !prev);
              const t = setTimeout(nextFlicker, flickers[step]);
              timeouts.push(t);
              step++;
            }
            nextFlicker();
          }, LOGO_ANIM.glitchDelay);
          timeouts.push(t2);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 400 + LOGO_ANIM.asciiDuration);
    timeouts.push(t1);

    return () => {
      clearInterval(asciiInterval);
      timeouts.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const linkStyle = useMemo(() => ({
    fontSize: "clamp(28px,4vw,48px)",
    lineHeight: 1 as const,
    letterSpacing: "-0.02em",
    width: "clamp(100px,14vw,180px)",
  }), []);

  const wrapperStyle = useMemo(() => ({
    transform: phase === "enter" ? "translateY(-120%)" : "translateY(0)",
    opacity: phase === "enter" ? 0 : 1,
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
    overflow: "visible" as const,
  }), [phase]);

  return (
    <Link
      href="/"
      aria-label="SF//UX, go to homepage"
      className="sf-logo sf-display no-underline shrink-0 mr-[clamp(8px,1.2vw,16px)] flex items-baseline gap-0 text-foreground"
      style={linkStyle}
    >
      <span
        className="inline-flex items-baseline"
        aria-hidden="true"
        style={wrapperStyle}
      >
        {chars.map((char, i) => {
          const isSlash = i === 2;
          const showColor = isSlash && (flickerOn || phase === "done");
          // Hide slashes until settled phase
          const slashVisible = isSlash ? (phase === "settled" || phase === "flicker" || phase === "done") : true;
          return (
            <span
              key={i}
              className={`inline-block sf-logo-char ${isSlash ? "sf-logo-slash" : ""}`}
              style={{
                color: showColor ? "var(--color-primary)" : undefined,
                fontSize: isSlash ? "clamp(20px,3vw,36px)" : undefined,
                verticalAlign: isSlash ? "baseline" : undefined,
                alignSelf: isSlash ? "flex-end" : undefined,
                opacity: isSlash ? (slashVisible ? 1 : 0) : undefined,
                transform: isSlash
                  ? slashVisible ? "translateY(0)" : "translateY(-100%)"
                  : undefined,
                transition: isSlash ? "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease" : undefined,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>

    </Link>
  );
});

function isActivePath(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-[var(--z-nav)] bg-background border-b-[3px] border-foreground">
      <div className="flex items-center px-[clamp(12px,2vw,24px)] py-[clamp(4px,1vw,8px)] text-[clamp(10px,1.3vw,15px)] font-bold uppercase tracking-[0.15em]">
        {/* Logo: SF//UX */}
        <LogoMark />

        {/* Nav links */}
        <div className="hidden md:flex items-center shrink-0 -ml-[clamp(4px,0.5vw,8px)]">
          {NAV_LINKS.map((link, i) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              ariaLabel={link.ariaLabel}
              external={link.external}
              delay={NAV_LINK_ANIM.baseDelay + i * NAV_LINK_ANIM.stagger}
              isActive={isActivePath(link.href, pathname)}
            />
          ))}
        </div>

        {/* Mobile nav — full-screen overlay */}
        <div className="md:hidden ml-2">
          <button
            onClick={() => setOverlayOpen(true)}
            className="border-2 border-foreground px-2.5 py-1.5 text-[var(--text-sm)] uppercase tracking-wider font-bold"
            aria-label="Open navigation menu"
            aria-expanded={overlayOpen}
          >
            MENU
          </button>
        </div>

        <NavOverlay
          open={overlayOpen}
          onClose={() => setOverlayOpen(false)}
          links={NAV_LINKS}
        />

        {/* Right side: command palette trigger + dark mode toggle + clock */}
        <div className="flex items-center gap-[clamp(8px,1.5vw,24px)] ml-auto">
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden sm:flex items-center gap-1.5 border-2 border-foreground px-2 py-1 text-[var(--text-xs)] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-200"
            aria-label="Open command palette (Cmd+K)"
          >
            <span className="text-primary">⌘</span>K
          </button>
          <DarkModeToggle />
          <div className="hidden sm:block">
            <LiveClock />
          </div>
        </div>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </nav>
  );
}
