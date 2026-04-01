import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SFSkeletonProps extends React.ComponentProps<typeof Skeleton> {}

export function SFSkeleton({ className, ...props }: SFSkeletonProps) {
  return (
    <Skeleton
      className={cn(
        "rounded-none bg-muted animate-none sf-skeleton",
        className
      )}
      {...props}
    />
  );
}
