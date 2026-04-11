"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

/**
 * Grouped input with addons — FRAME layer form primitive.
 * Wraps all sub-elements with zero border-radius.
 *
 * Overrides `ui/input-group.tsx`'s `rounded-lg` on the root and
 * CVA-generated `rounded-[calc(var(--radius)-5px)]` / `rounded-[calc(var(--radius)-3px)]`
 * on addon and button children.
 *
 * @example
 * <SFInputGroup>
 *   <SFInputGroupAddon align="inline-start">
 *     <SFInputGroupText>@</SFInputGroupText>
 *   </SFInputGroupAddon>
 *   <SFInputGroupInput placeholder="username" />
 *   <SFInputGroupAddon align="inline-end">
 *     <SFInputGroupButton>Send</SFInputGroupButton>
 *   </SFInputGroupAddon>
 * </SFInputGroup>
 */
function SFInputGroup({
  className,
  ...props
}: React.ComponentProps<typeof InputGroup>) {
  return (
    <InputGroup
      className={cn("rounded-none border-foreground", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFInputGroup — addon wrapper for inline or block decorators. Zero border-radius on kbd children.
 * @example
 * <SFInputGroupAddon align="inline-start"><SFInputGroupText>@</SFInputGroupText></SFInputGroupAddon>
 */
function SFInputGroupAddon({
  className,
  ...props
}: React.ComponentProps<typeof InputGroupAddon>) {
  return (
    <InputGroupAddon
      className={cn("rounded-none [&>kbd]:rounded-none", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFInputGroup — action button inside input group. Overrides CVA's calc-based radius with rounded-none.
 * @example
 * <SFInputGroupAddon align="inline-end"><SFInputGroupButton>Send</SFInputGroupButton></SFInputGroupAddon>
 */
function SFInputGroupButton({
  className,
  ...props
}: React.ComponentProps<typeof InputGroupButton>) {
  return (
    <InputGroupButton
      className={cn("rounded-none", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFInputGroup — non-interactive text label or icon inside the group.
 * @example
 * <SFInputGroupText>@</SFInputGroupText>
 */
function SFInputGroupText({
  className,
  ...props
}: React.ComponentProps<typeof InputGroupText>) {
  return (
    <InputGroupText className={cn("rounded-none", className)} {...props} />
  );
}

/**
 * Sub-component of SFInputGroup — the primary input field. Base already applies rounded-none; passthrough maintains the contract.
 * @example
 * <SFInputGroupInput placeholder="username" />
 */
function SFInputGroupInput({
  className,
  ...props
}: React.ComponentProps<typeof InputGroupInput>) {
  return (
    <InputGroupInput
      className={cn("rounded-none", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFInputGroup — multiline textarea variant. Base already applies rounded-none; passthrough maintains the contract.
 * @example
 * <SFInputGroupTextarea placeholder="Enter your message..." rows={4} />
 */
function SFInputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<typeof InputGroupTextarea>) {
  return (
    <InputGroupTextarea
      className={cn("rounded-none", className)}
      {...props}
    />
  );
}

export {
  SFInputGroup,
  SFInputGroupAddon,
  SFInputGroupButton,
  SFInputGroupText,
  SFInputGroupInput,
  SFInputGroupTextarea,
};
