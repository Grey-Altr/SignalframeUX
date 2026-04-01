"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap-plugins";

interface SplitHeadlineProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
  delay?: number;
  stagger?: number;
}

export function SplitHeadline({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  stagger = 0.02,
}: SplitHeadlineProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      SplitText.create(ref.current, {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit(self: { chars: Element[] }) {
          gsap.from(self.chars, {
            y: "100%",
            opacity: 0,
            duration: 0.5,
            stagger,
            delay,
            ease: "sf-snap",
          });
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {text}
    </Tag>
  );
}
