import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
