"use client";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * User identity avatar — FRAME layer identity primitive.
 * Square crop, Radix fallback chain: image -> initials -> icon.
 *
 * All sub-elements enforce rounded-none to override Radix's
 * default rounded-full. When SFAvatarFallback has no children,
 * a Lucide User icon renders at 60% container size.
 *
 * @param className - Merged via cn() after rounded-none overrides
 *
 * @example
 * <SFAvatar>
 *   <SFAvatarImage src="/avatar.png" alt="User" />
 *   <SFAvatarFallback>JD</SFAvatarFallback>
 * </SFAvatar>
 */
function SFAvatar({
  className,
  ...props
}: React.ComponentProps<typeof Avatar>) {
  return (
    <Avatar
      className={cn("rounded-none after:rounded-none", className)}
      {...props}
    />
  );
}

/** Sub-component of SFAvatar — image element with square crop. */
function SFAvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarImage>) {
  return (
    <AvatarImage className={cn("rounded-none", className)} {...props} />
  );
}

/** Sub-component of SFAvatar — fallback with initials or default User icon. */
function SFAvatarFallback({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AvatarFallback>) {
  return (
    <AvatarFallback className={cn("rounded-none", className)} {...props}>
      {children ?? <User className="size-[60%] text-foreground" />}
    </AvatarFallback>
  );
}

export { SFAvatar, SFAvatarImage, SFAvatarFallback };
