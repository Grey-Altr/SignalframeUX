import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Loading placeholder — FRAME layer state primitive.
 *
 * Renders an accessible skeleton block with aria role="status" and
 * a custom sf-skeleton shimmer animation (no rounded corners). Use to
 * represent content loading states in place of actual content.
 *
 * @param className - Merged via cn() — set width/height to match target content shape
 *
 * @example
 * <SFSkeleton className="h-4 w-48" />
 * <SFSkeleton className="h-32 w-full" />
 */
export function SFSkeleton({ className, ...props }: React.ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton
      role="status"
      aria-label="Loading..."
      className={cn(
        "rounded-none animate-none sf-skeleton",
        className
      )}
      {...props}
    />
  );
}
