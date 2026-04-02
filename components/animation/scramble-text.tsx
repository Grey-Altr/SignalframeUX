"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-split";

const SF_CHARS = "!<>-_\\/[]{}—=+*^?#01シグナル";

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: "load" | "hover";
  chars?: string;
}

export function ScrambleText({
  text,
  className,
  trigger = "hover",
  chars = SF_CHARS,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (trigger === "load" && ref.current) {
        gsap.from(ref.current, {
          duration: 1,
          scrambleText: {
            text: "",
            chars,
            revealDelay: 0.5,
            speed: 0.3,
          },
        });
      }
    },
    { scope: ref, dependencies: [trigger] }
  );

  const handleHover = contextSafe(() => {
    gsap.to(ref.current!, {
      duration: 0.8,
      scrambleText: {
        text,
        chars,
        revealDelay: 0.3,
        speed: 0.4,
      },
    });
  });

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={trigger === "hover" ? handleHover : undefined}
    >
      {text}
    </span>
  );
}
