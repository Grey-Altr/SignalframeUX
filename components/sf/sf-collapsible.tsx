"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

/**
 * Toggleable content panel — FRAME layer disclosure primitive.
 *
 * Radix Collapsible root wrapped with SF contract. Compose with
 * SFCollapsibleTrigger (supports asChild) and SFCollapsibleContent.
 *
 * @example
 * <SFCollapsible>
 *   <SFCollapsibleTrigger asChild><SFButton>Toggle</SFButton></SFCollapsibleTrigger>
 *   <SFCollapsibleContent>Hidden content here</SFCollapsibleContent>
 * </SFCollapsible>
 */
function SFCollapsible(props: React.ComponentProps<typeof Collapsible>) {
  return <Collapsible {...props} />;
}

/**
 * Sub-component of SFCollapsible — trigger element that toggles content visibility.
 * @example
 * <SFCollapsibleTrigger asChild><SFButton>Toggle</SFButton></SFCollapsibleTrigger>
 */
function SFCollapsibleTrigger(
  props: React.ComponentProps<typeof CollapsibleTrigger>
) {
  return <CollapsibleTrigger {...props} />;
}

/**
 * Sub-component of SFCollapsible — collapsible content region that shows/hides on trigger.
 * @example
 * <SFCollapsibleContent>Hidden content revealed on toggle</SFCollapsibleContent>
 */
function SFCollapsibleContent(
  props: React.ComponentProps<typeof CollapsibleContent>
) {
  return <CollapsibleContent {...props} />;
}

export { SFCollapsible, SFCollapsibleTrigger, SFCollapsibleContent };
