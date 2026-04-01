"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

function useScrambleText(target: string, delay: number, duration = 600) {
  const [text, setText] = useState(target);

  useEffect(() => {
    const chars = target.split("");
    const settled = new Set<number>();
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    // Immediately scramble on mount
    setText(chars.map(() => SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]).join(""));

    timeout = setTimeout(() => {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const result = chars.map((c, i) => {
          if (c === " ") return " ";
          const settleAt = (i / chars.length) * 0.7 + 0.3;
          if (progress >= settleAt || settled.has(i)) {
            settled.add(i);
            return c;
          }
          return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
        });

        setText(result.join(""));
        if (settled.size >= chars.filter(c => c !== " ").length) {
          clearInterval(interval);
        }
      }, 40);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval!);
    };
  }, [target, delay, duration]);

  return text;
}

function NavLink({ href, label, delay }: { href: string; label: string; delay: number }) {
  const [text, setText] = useState(label);

  // Load scramble only — no hover scramble
  useEffect(() => {
    const chars = label.split("");
    setText(chars.map(() => SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]).join(""));

    const timeout = setTimeout(() => {
      const settled = new Set<number>();
      const startTime = Date.now();
      const iv = setInterval(() => {
        const progress = Math.min((Date.now() - startTime) / 500, 1);
        const result = chars.map((c, i) => {
          if (settled.has(i)) return c;
          if (progress >= (i / chars.length) * 0.7 + 0.3) { settled.add(i); return c; }
          return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
        });
        setText(result.join(""));
        if (settled.size >= chars.length) clearInterval(iv);
      }, 40);
    }, delay);

    return () => clearTimeout(timeout);
  }, [label, delay]);

  return (
    <Link
      href={href}
      data-anim="nav-link"
      className="nav-hover-link relative text-foreground no-underline mr-[clamp(6px,1vw,14px)] inline-block transition-colors duration-300 hover:text-primary"
    >
      {text}
      <span className="nav-hover-underline" />
    </Link>
  );
}

const NAV_LINKS = [
  { href: "/components", label: "COMPONENTS" },
  { href: "/api", label: "API" },
  { href: "/tokens", label: "TOKENS" },
  { href: "/start", label: "START" },
  { href: "https://github.com", label: "GITHUB" },
];

const SCRAMBLE_FRAMES = 28;
const SCRAMBLE_FRAMES_INIT = 180;

function LiveClock() {
  const [display, setDisplay] = useState<string[]>([]);
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
    // Initialize with scramble on load
    const initial = getTimeString();
    prevTimeRef.current = initial;
    // Start all digits scrambling with longer initial duration
    for (let i = 0; i < initial.length; i++) {
      if (initial[i] !== ":") {
        scrambleRef.current.set(i, { frame: -(SCRAMBLE_FRAMES_INIT - SCRAMBLE_FRAMES), target: initial[i] });
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
      let lastTickTime = 0;

      function tick(now: number) {
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
            const progress = 1 - Math.abs(state.frame) / (SCRAMBLE_FRAMES_INIT - SCRAMBLE_FRAMES);
            // Skip more frames as we approach the end (slowing down)
            const skipChance = progress * progress * 0.85;
            if (Math.random() < skipChance) {
              // Don't increment — hold current digit longer
              return;
            }
          }

          state.frame++;
          if (state.frame >= SCRAMBLE_FRAMES) {
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

    return () => {
      clearInterval(interval);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [getTimeString]);

  return (
    <span
      className="text-[clamp(28px,4vw,48px)] leading-none tracking-tight tabular-nums"
      style={{
        fontFamily: "var(--font-anton)",
        fontVariantNumeric: "tabular-nums",
      }}
      aria-label={`Current time: ${display.join("")}`}
    >
      {display.map((char, i) => (
        <span
          key={i}
          className={`inline-block text-center leading-none ${
            char === ":" ? "w-[0.2em]" : "w-[0.48em]"
          }`}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [renderPhase, setRenderPhase] = useState(0); // 0=hidden, 1-5=render lines, 6=solid
  const lightText = useScrambleText("LIGHT", 600, 400);
  const darkText = useScrambleText("DARK", 700, 400);

  useEffect(() => {
    // Graphic render effect: progressively draw the toggle like scan lines
    const phases = [500, 580, 640, 700, 740, 780, 850];
    const timeouts = phases.map((delay, i) =>
      setTimeout(() => setRenderPhase(i + 1), delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.add("sf-theme-transition");
    root.classList.toggle("dark", next);
    setTimeout(() => root.classList.remove("sf-theme-transition"), 400);
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
      <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
        {lightText}
      </span>
      <button
        onClick={toggle}
        className="relative w-[42px] h-[20px] border-2 border-foreground bg-transparent shrink-0 cursor-pointer"
        aria-label="Toggle dark mode"
        style={{
          clipPath: renderPhase < 4 ? `inset(0 0 ${100 - renderPhase * 30}% 0)` : "none",
        }}
      >
        <div
          className="absolute top-[2px] w-3 h-3 bg-foreground transition-all duration-300"
          style={{
            left: dark ? "24px" : "2px",
            backgroundColor: dark ? "oklch(0.65 0.29 350)" : undefined,
            transitionTimingFunction: "cubic-bezier(0.68, -0.2, 0.27, 1.2)",
          }}
        />
      </button>
      <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
        DARK
      </span>
    </div>
  );
}

const LOGO_TARGET = ["S", "F", "//", "U", "X"];
const ASCII_CHARS = "!@#$%^&*<>{}[]|/\\~`+=_-";
const LOGO_SCRAMBLE_FRAMES = 40;
const LOGO_ASCII_DURATION = 800;
const LOGO_GLITCH_DELAY = 300;

type LogoPhase = "enter" | "ascii" | "scramble" | "settled" | "flicker" | "done";

function LogoMark() {
  const [chars, setChars] = useState(LOGO_TARGET);
  const [phase, setPhase] = useState<LogoPhase>("enter");
  const [flickerOn, setFlickerOn] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
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
          const settleAt = (i + 1) * (LOGO_SCRAMBLE_FRAMES / LOGO_TARGET.length);
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
          }, LOGO_GLITCH_DELAY);
          timeouts.push(t2);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 400 + LOGO_ASCII_DURATION);
    timeouts.push(t1);

    return () => {
      clearInterval(asciiInterval);
      timeouts.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <Link
      href="/"
      className="sf-logo no-underline shrink-0 mr-[clamp(8px,1.2vw,16px)] flex items-baseline gap-0 text-foreground"
      style={{
        fontFamily: "var(--font-anton)",
        fontSize: "clamp(28px,4vw,48px)",
        lineHeight: 1,
        letterSpacing: "-0.02em",
        width: "clamp(100px,14vw,180px)",
      }}
    >
      <span
        className="inline-flex items-baseline"
        style={{
          transform: phase === "enter" ? "translateY(-120%)" : "translateY(0)",
          opacity: phase === "enter" ? 0 : 1,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
          overflow: "visible",
        }}
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
                color: showColor ? "oklch(0.65 0.29 350)" : undefined,
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

      <style jsx>{`
        .sf-logo-char {
          transform: translate(0, 0);
          color: inherit;
        }
        .sf-logo:hover .sf-logo-char {
          animation: logoGlitch 0.3s steps(2) infinite;
        }
        .sf-logo:not(:hover) .sf-logo-char {
          animation: none;
          transform: translate(0, 0);
        }
        .sf-logo:hover .sf-logo-slash {
          animation: slashPulse 0.4s ease infinite;
        }
        .sf-logo:not(:hover) .sf-logo-slash {
          animation: none;
        }
        @keyframes logoGlitch {
          0% {
            transform: translate(0, 0);
            color: inherit;
          }
          20% {
            transform: translate(-2px, 1px);
            color: oklch(0.65 0.29 350);
          }
          40% {
            transform: translate(1px, -1px);
            color: inherit;
          }
          60% {
            transform: translate(-1px, 2px);
            color: inherit;
          }
          80% {
            transform: translate(2px, -1px);
            color: oklch(0.65 0.29 350);
          }
          100% {
            transform: translate(0, 0);
            color: inherit;
          }
        }
        @keyframes slashPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </Link>
  );
}

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b-[3px] border-foreground">
      <div className="flex items-center px-[clamp(12px,2vw,24px)] py-[clamp(4px,1vw,8px)] text-[clamp(10px,1.3vw,15px)] font-bold uppercase tracking-[0.15em]">
        {/* Logo: SF//UX */}
        <LogoMark />

        {/* Nav links */}
        <div className="flex items-center shrink-0 -ml-[clamp(4px,0.5vw,8px)]">
          {NAV_LINKS.map((link, i) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              delay={300 + i * 120}
            />
          ))}
        </div>

        {/* Right side: dark mode toggle + clock */}
        <div className="flex items-center gap-6 ml-auto">
          <DarkModeToggle />
          <LiveClock />
        </div>
      </div>
    </nav>
  );
}
