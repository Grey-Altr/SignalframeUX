"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-core";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}

export function ScrollReveal({
  children,
  className,
  stagger = 0.08,
  y = 30,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const items = ref.current.children;
      if (items.length === 0) return;

      gsap.from(items, {
        y,
        opacity: 0,
        duration: 0.6,
        stagger,
        ease: "sf-snap",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
