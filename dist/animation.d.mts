import * as React$1 from 'react';
import { RefObject } from 'react';
import { Accordion as Accordion$1, Progress } from 'radix-ui';
export { default as gsap } from 'gsap';
export { ScrollTrigger } from 'gsap/ScrollTrigger';
export { Observer } from 'gsap/Observer';
export { useGSAP } from '@gsap/react';
export { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
export { Flip } from 'gsap/Flip';
export { CustomEase } from 'gsap/CustomEase';
export { SplitText } from 'gsap/SplitText';
export { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

declare function Accordion({ className, ...props }: React$1.ComponentProps<typeof Accordion$1.Root>): React$1.JSX.Element;
declare function AccordionItem({ className, ...props }: React$1.ComponentProps<typeof Accordion$1.Item>): React$1.JSX.Element;
declare function AccordionTrigger({ className, children, ...props }: React$1.ComponentProps<typeof Accordion$1.Trigger>): React$1.JSX.Element;
declare function AccordionContent({ className, children, ...props }: React$1.ComponentProps<typeof Accordion$1.Content>): React$1.JSX.Element;

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
/**
 * SFAccordion root — SIGNAL layer accordion with GSAP stagger animation on expand.
 * @example
 * <SFAccordion type="single" collapsible><SFAccordionItem value="item-1"><SFAccordionTrigger>Section</SFAccordionTrigger><SFAccordionContent>Content</SFAccordionContent></SFAccordionItem></SFAccordion>
 */
declare function SFAccordion({ className, ...props }: React$1.ComponentProps<typeof Accordion>): React$1.JSX.Element;
/**
 * Sub-component of SFAccordion — individual accordion panel with bottom border separator.
 * @example
 * <SFAccordionItem value="item-1"><SFAccordionTrigger>Section One</SFAccordionTrigger><SFAccordionContent>Body</SFAccordionContent></SFAccordionItem>
 */
declare function SFAccordionItem({ className, ...props }: React$1.ComponentProps<typeof AccordionItem>): React$1.JSX.Element;
/**
 * Sub-component of SFAccordion — trigger button that expands/collapses the accordion item.
 * @example
 * <SFAccordionTrigger>Section One</SFAccordionTrigger>
 */
declare function SFAccordionTrigger({ className, ...props }: React$1.ComponentProps<typeof AccordionTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFAccordion — content region with GSAP stagger animation on child elements.
 * @example
 * <SFAccordionContent><p>First paragraph</p><p>Second paragraph</p></SFAccordionContent>
 */
declare function SFAccordionContent({ className, children, ...props }: React$1.ComponentProps<typeof AccordionContent>): React$1.JSX.Element;

/**
 * SFProgress -- SIGNAL layer progress bar with GSAP fill tween.
 *
 * Wraps Radix Progress directly (not shadcn base) to gain ref access
 * on the indicator. GSAP is the sole animation driver -- no CSS
 * transition-all. Respects prefers-reduced-motion (instant gsap.set).
 *
 * @param value - Progress percentage 0-100
 * @param className - Additional classes on root
 *
 * @example
 * ```tsx
 * <SFProgress value={60} />
 * <SFProgress value={100} className="h-2" />
 * ```
 */
interface SFProgressProps extends React$1.ComponentProps<typeof Progress.Root> {
    value?: number;
}
declare function SFProgress({ className, value, ...props }: SFProgressProps): React$1.JSX.Element;

/**
 * Presence indicator -- FRAME layer status primitive.
 * 8px square, GSAP pulse on active state. Respects prefers-reduced-motion.
 *
 * @param status - Current state: "active" (pulsing green), "idle" (accent), "offline" (muted)
 * @param className - Additional classes merged onto the dot element
 *
 * @example
 * <SFStatusDot status="active" />
 * <SFStatusDot status="idle" />
 * <SFStatusDot status="offline" />
 */
type SFStatusDotStatus = "active" | "idle" | "offline";
interface SFStatusDotProps {
    status?: SFStatusDotStatus;
    className?: string;
}
declare function SFStatusDot({ status, className }: SFStatusDotProps): React$1.JSX.Element;

interface SFToastContentProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    intent?: "default" | "success" | "destructive" | "warning";
    onDismiss: () => void;
}
/**
 * SFToaster — global toast container positioned bottom-left at z-100.
 * Place once in app/layout.tsx as a sibling to {children}.
 *
 * Uses Sonner in unstyled mode for full DU/TDR control.
 * Toast notifications slide in from the left via GSAP, respecting prefers-reduced-motion.
 *
 * @example
 * // In app/layout.tsx:
 * <SFToaster />
 *
 * // Trigger from any client component:
 * import { sfToast } from "@/components/sf";
 * sfToast.success("OPERATION COMPLETE");
 */
declare function SFToaster(): React$1.JSX.Element;
/**
 * sfToast — imperative toast API.
 * Triggers custom Sonner toasts rendered with SFToastContent + GSAP slide.
 *
 * @example
 * sfToast.default("SYSTEM NOTICE", { description: "All systems nominal" });
 * sfToast.success("SAVED");
 * sfToast.error("CRITICAL FAILURE");
 * sfToast.warning("LOW SIGNAL");
 * sfToast.info("UPDATE AVAILABLE");
 */
declare const sfToast: {
    default: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss">) => string | number;
    success: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss" | "icon" | "intent">) => string | number;
    error: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss" | "icon" | "intent">) => string | number;
    warning: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss" | "icon" | "intent">) => string | number;
    info: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss" | "icon" | "intent">) => string | number;
};

/**
 * SFStepper -- SIGNAL layer vertical multi-step flow component.
 *
 * Renders a vertical sequence of steps with SFProgress connectors
 * between them. Each step has a status indicator (square, not circle)
 * and optional label/description. Connectors use actual SFProgress
 * instances for GSAP-driven fill animation.
 *
 * @param activeStep - Zero-based index of the current active step
 * @param children - SFStep elements
 * @param className - Additional classes on root container
 *
 * @example
 * <SFStepper activeStep={1}>
 *   <SFStep status="complete" label="Account" description="Create your account" />
 *   <SFStep status="active" label="Profile" description="Set up your profile" />
 *   <SFStep status="pending" label="Review" description="Review and submit" />
 * </SFStepper>
 *
 * <SFStepper activeStep={2}>
 *   <SFStep status="complete" label="Upload" />
 *   <SFStep status="error" label="Validate" description="3 errors found" />
 *   <SFStep status="pending" label="Publish" />
 * </SFStepper>
 */
type StepStatus = "pending" | "active" | "complete" | "error";
interface SFStepperProps {
    activeStep: number;
    children: React$1.ReactNode;
    className?: string;
}
interface SFStepProps {
    status?: StepStatus;
    label?: string;
    description?: string;
    children?: React$1.ReactNode;
    className?: string;
}
declare function SFStepper({ activeStep: _activeStep, children, className }: SFStepperProps): React$1.JSX.Element;
/**
 * Sub-component of SFStepper — individual step with status indicator, label, and optional description.
 * @example
 * <SFStep status="complete" label="Account" description="Create your account" />
 */
declare function SFStep({ status, label, description, children, className, }: SFStepProps): React$1.JSX.Element;

/**
 * Designed empty state -- FRAME layer placeholder with DU/TDR tension.
 * Bayer dither background, monospace text, optional ScrambleText SIGNAL treatment.
 *
 * @param title - Primary message text displayed in monospace uppercase
 * @param scramble - When true, title renders inside ScrambleText for SIGNAL layer effect
 * @param action - Optional action slot (e.g., a button to retry or navigate)
 * @param className - Additional classes merged onto the outer container
 * @param children - Optional description content rendered below the title
 *
 * @example
 * <SFEmptyState title="NO DATA FOUND" scramble>
 *   <p>Try adjusting your filters.</p>
 * </SFEmptyState>
 */
interface SFEmptyStateProps {
    title: string;
    scramble?: boolean;
    action?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}
declare function SFEmptyState({ title, scramble, action, className, children, }: SFEmptyStateProps): React$1.JSX.Element;

/**
 * Drives nav reveal via `document.body.dataset.navVisible`.
 *
 * CONTRACT (CONTEXT.md section VL -- Nav reveal pattern, LOCKED):
 * - Homepage: pass a ref to the ENTRY section (`[data-entry-section]`).
 * - Subpages: pass a ref to the page <header> element (the one wrapping the h1).
 *   Nav appears once the page header scrolls out of view.
 * - `triggerRef.current === null` is a SAFETY FALLBACK ONLY (logs a dev-mode warning)
 *   -- subpages MUST pass a real header. Do not rely on the null branch.
 *
 * Reduced motion: nav visible immediately, no ScrollTrigger.
 *
 * The Nav DOM element MUST carry `sf-nav-hidden` as its initial className. The CSS
 * rule in app/globals.css flips visibility based on `body[data-nav-visible="true"]`.
 *
 * @param triggerRef - Ref to the element whose scroll-out triggers nav reveal
 *
 * @example
 * const headerRef = useRef<HTMLElement>(null);
 * useNavReveal(headerRef);
 * return <header ref={headerRef}><h1>Page Title</h1></header>;
 */
declare function useNavReveal(triggerRef: RefObject<HTMLElement | null>): void;

/**
 * SignalframeUX custom GSAP easings — single canonical source.
 * Import from any gsap-* entry point that has CustomEase registered.
 * Registers `sf-snap` (stepped bounce) and `sf-punch` (overshoot) easings.
 *
 * @example
 * // Called automatically by gsap-plugins.ts, gsap-flip.ts, gsap-split.ts.
 * // Manual use: import and call once at app init.
 * registerSFEasings();
 * gsap.to(el, { x: 100, ease: "sf-snap", duration: 0.4 });
 */
declare function registerSFEasings(): void;

declare function initReducedMotion(): () => void;

export { SFAccordion, SFAccordionContent, SFAccordionItem, SFAccordionTrigger, SFEmptyState, SFProgress, SFStatusDot, type SFStatusDotStatus, SFStep, SFStepper, SFToaster, initReducedMotion, registerSFEasings, sfToast, useNavReveal };
