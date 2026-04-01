"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/components", label: "COMPONENTS" },
  { href: "/api", label: "API" },
  { href: "/tokens", label: "TOKENS" },
  { href: "/start", label: "START" },
  { href: "https://github.com", label: "GITHUB" },
];

const SCRAMBLE_FRAMES = 28;

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
    // Initialize display
    const initial = getTimeString();
    setDisplay(initial.split(""));
    prevTimeRef.current = initial;

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
          className="inline-block w-[0.45em] text-right mr-[0.04em] leading-none"
        >
          {char}
        </span>
      ))}
    </span>
  );
}

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
        LIGHT
      </span>
      <button
        onClick={toggle}
        className="relative w-[42px] h-[20px] border-2 border-foreground bg-transparent shrink-0 cursor-pointer"
        aria-label="Toggle dark mode"
      >
        <div
          className="absolute top-[2px] w-3 h-3 bg-foreground transition-all duration-100"
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

const LOGO_CHARS = [
  { char: "S", delay: "0.1s", type: "up" as const },
  { char: "F", delay: "0.2s", type: "up" as const },
  { char: "//", delay: "0.8s", type: "down" as const },
  { char: "U", delay: "0.4s", type: "up" as const },
  { char: "X", delay: "0.5s", type: "up" as const },
];

function LogoMark() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance after mount
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Link
      href="/"
      className="sf-logo no-underline shrink-0 mr-[clamp(16px,2.5vw,32px)] flex items-center gap-0 text-foreground"
      style={{
        fontFamily: "var(--font-anton)",
        fontSize: "clamp(28px,4vw,48px)",
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
    >
      {LOGO_CHARS.map((item, i) => {
        const isSlash = item.char === "//";
        return (
          <span
            key={i}
            className={`inline-block sf-logo-char ${isSlash ? "sf-logo-slash text-primary text-[clamp(20px,3vw,36px)]" : ""}`}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted
                ? "translateY(0)"
                : item.type === "up"
                  ? "translateY(100%)"
                  : "translateY(-100%)",
              transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${item.delay}, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${item.delay}`,
            }}
          >
            {item.char}
          </span>
        );
      })}

      <style jsx>{`
        .sf-logo:hover .sf-logo-char {
          animation: logoGlitch 0.3s steps(2) infinite;
        }
        .sf-logo:hover .sf-logo-slash {
          animation: slashPulse 0.4s ease infinite;
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
      <div className="flex items-center px-[clamp(12px,2vw,24px)] py-[clamp(10px,1.5vw,16px)] text-[clamp(10px,1.3vw,15px)] font-bold uppercase tracking-[0.15em]">
        {/* Logo: SF//UX */}
        <LogoMark />

        {/* Nav links */}
        <div className="flex items-center shrink-0">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-anim="nav-link"
              className="relative text-foreground no-underline mr-[clamp(8px,1.5vw,20px)] inline-block hover:text-primary after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100"
            >
              {link.label}
            </Link>
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
