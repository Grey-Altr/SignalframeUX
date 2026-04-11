"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

/**
 * One-time password input — FRAME layer form primitive.
 *
 * Individual character slots for verification codes. Keyboard navigable,
 * supports paste and SMS autofill. Zero border-radius on all slots.
 *
 * @example
 * <SFInputOTP maxLength={6}>
 *   <SFInputOTPGroup>
 *     <SFInputOTPSlot index={0} />
 *     <SFInputOTPSlot index={1} />
 *     <SFInputOTPSlot index={2} />
 *   </SFInputOTPGroup>
 *   <SFInputOTPSeparator />
 *   <SFInputOTPGroup>
 *     <SFInputOTPSlot index={3} />
 *     <SFInputOTPSlot index={4} />
 *     <SFInputOTPSlot index={5} />
 *   </SFInputOTPGroup>
 * </SFInputOTP>
 */
function SFInputOTP({
  className,
  ...props
}: React.ComponentProps<typeof InputOTP>) {
  return (
    <InputOTP className={cn("font-mono", className)} {...props} />
  );
}

/**
 * Sub-component of SFInputOTP — groups slots together visually. Zero border-radius on group container.
 * @example
 * <SFInputOTPGroup><SFInputOTPSlot index={0} /><SFInputOTPSlot index={1} /></SFInputOTPGroup>
 */
function SFInputOTPGroup({
  className,
  ...props
}: React.ComponentProps<typeof InputOTPGroup>) {
  return (
    <InputOTPGroup className={cn("rounded-none", className)} {...props} />
  );
}

/**
 * Sub-component of SFInputOTP — individual character slot. Zero radius, 2px foreground border, ring on active state.
 * @example
 * <SFInputOTPSlot index={0} />
 */
function SFInputOTPSlot({
  className,
  ...props
}: React.ComponentProps<typeof InputOTPSlot>) {
  return (
    <InputOTPSlot
      className={cn(
        "rounded-none border-2 border-foreground first:rounded-none last:rounded-none data-[active=true]:border-primary data-[active=true]:ring-1 data-[active=true]:ring-primary",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFInputOTP — visual separator between slot groups (renders a dash by default).
 * @example
 * <SFInputOTPSeparator />
 */
function SFInputOTPSeparator(
  props: React.ComponentProps<typeof InputOTPSeparator>
) {
  return <InputOTPSeparator {...props} />;
}

export { SFInputOTP, SFInputOTPGroup, SFInputOTPSlot, SFInputOTPSeparator };
