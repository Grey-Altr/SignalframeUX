"use client";

import * as React from "react";
import { useRef, useEffect, useCallback } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { gsap } from "@/lib/gsap-core";
import { cn } from "@/lib/utils";

/**
 * SFAccordion -- SIGNAL layer accordion with GSAP stagger animation.
 *
 * Wraps shadcn/Radix Accordion with:
 * - GSAP stagger on child elements when panels expand (50ms per child)
 * - Reverse stagger on collapse
 * - prefers-reduced-motion guard (instant state, no animation)
 * - rounded-none on all sub-elements (DU/TDR sharp edges)
 *
 * @example
 * ```tsx
 * <SFAccordion type="single" collapsible>
 *   <SFAccordionItem value="item-1">
 *     <SFAccordionTrigger>Section One</SFAccordionTrigger>
 *     <SFAccordionContent>
 *       <p>First paragraph</p>
 *       <p>Second paragraph</p>
 *     </SFAccordionContent>
 *   </SFAccordionItem>
 * </SFAccordion>
 * ```
 */

/* ------------------------------------------------------------------ */
/*  SFAccordion (root)                                                 */
/* ------------------------------------------------------------------ */

/**
 * SFAccordion root — SIGNAL layer accordion with GSAP stagger animation on expand.
 * @example
 * <SFAccordion type="single" collapsible><SFAccordionItem value="item-1"><SFAccordionTrigger>Section</SFAccordionTrigger><SFAccordionContent>Content</SFAccordionContent></SFAccordionItem></SFAccordion>
 */
function SFAccordion({
  className,
  ...props
}: React.ComponentProps<typeof Accordion>) {
  return (
    <Accordion
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SFAccordionItem                                                    */
/* ------------------------------------------------------------------ */

/**
 * Sub-component of SFAccordion — individual accordion panel with bottom border separator.
 * @example
 * <SFAccordionItem value="item-1"><SFAccordionTrigger>Section One</SFAccordionTrigger><SFAccordionContent>Body</SFAccordionContent></SFAccordionItem>
 */
function SFAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionItem>) {
  return (
    <AccordionItem
      className={cn(
        "rounded-none border-b border-foreground/20",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SFAccordionTrigger                                                 */
/* ------------------------------------------------------------------ */

/**
 * Sub-component of SFAccordion — trigger button that expands/collapses the accordion item.
 * @example
 * <SFAccordionTrigger>Section One</SFAccordionTrigger>
 */
function SFAccordionTrigger({
  className,
  ...props
}: React.ComponentProps<typeof AccordionTrigger>) {
  return (
    <AccordionTrigger
      className={cn("rounded-none", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SFAccordionContent                                                 */
/* ------------------------------------------------------------------ */

/**
 * Sub-component of SFAccordion — content region with GSAP stagger animation on child elements.
 * @example
 * <SFAccordionContent><p>First paragraph</p><p>Second paragraph</p></SFAccordionContent>
 */
function SFAccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionContent>) {
  const contentRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const animateChildren = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    // Reduced-motion guard: skip all GSAP animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const childElements = el.children;
    if (childElements.length === 0) return;

    // Kill any in-flight tween
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    tweenRef.current = gsap.fromTo(
      childElements,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.out",
      }
    );
  }, []);

  useEffect(() => {
    // Content mounts only when open (Radix default behavior).
    // Animate children on mount.
    animateChildren();

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [animateChildren]);

  return (
    <AccordionContent
      className={cn("rounded-none", className)}
      {...props}
    >
      <div ref={contentRef}>{children}</div>
    </AccordionContent>
  );
}

export {
  SFAccordion,
  SFAccordionItem,
  SFAccordionTrigger,
  SFAccordionContent,
};
