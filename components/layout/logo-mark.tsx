"use client";

import { useState, useRef, useEffect, useMemo, memo } from "react";
import Link from "next/link";

const LOGO_TARGET = ["S", "F", "//", "U", "X"];
const ASCII_CHARS = "!@#$%^&*<>{}[]|/\\~`+=_-";
const LOGO_ANIM = {
  scrambleFrames: 40,
  asciiDuration: 2800,
  glitchDelay: 300,
} as const;

type LogoPhase = "enter" | "ascii" | "scramble" | "settled" | "flicker" | "done";

export const LogoMark = memo(function LogoMark() {
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
    fontSize: "clamp(48px,calc(6.5*var(--sf-vw)),80px)",
    lineHeight: 1 as const,
    letterSpacing: "-0.02em",
    width: "clamp(160px,calc(23*var(--sf-vw)),300px)",
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
      className="sf-logo sf-display no-underline shrink-0 mr-[clamp(8px,calc(1.2*var(--sf-vw)),16px)] flex items-baseline gap-0 text-foreground"
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
                fontSize: isSlash ? "clamp(36px,calc(5*var(--sf-vw)),62px)" : undefined,
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
