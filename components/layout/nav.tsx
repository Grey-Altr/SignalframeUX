"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/components", label: "COMPONENTS" },
  { href: "/api", label: "API" },
  { href: "/tokens", label: "TOKENS" },
  { href: "/start", label: "START" },
  { href: "https://github.com", label: "GITHUB" },
];

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="text-[clamp(28px,4vw,48px)] leading-none tracking-tight tabular-nums"
      style={{ fontFamily: "var(--font-anton)", fontVariantNumeric: "tabular-nums" }}
      aria-label={`Current time: ${time}`}
    >
      {time.split("").map((char, i) => (
        <span key={i} className="inline-block w-[0.45em] text-right mr-[0.04em] leading-none">
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

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b-[3px] border-foreground">
      <div className="flex items-center px-[clamp(12px,2vw,24px)] py-[clamp(10px,1.5vw,16px)] text-[clamp(10px,1.3vw,15px)] font-bold uppercase tracking-[0.15em]">
        {/* Logo: SF//UX */}
        <Link
          href="/"
          className="no-underline shrink-0 mr-[clamp(16px,2.5vw,32px)] flex items-center gap-0 text-foreground"
          style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(28px,4vw,48px)", lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          <span className="inline-block">S</span>
          <span className="inline-block">F</span>
          <span className="text-primary text-[clamp(20px,3vw,36px)]">//</span>
          <span className="inline-block">U</span>
          <span className="inline-block">X</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center shrink-0">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
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
