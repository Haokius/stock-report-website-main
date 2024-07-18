import { Skeleton } from "@/components/ui/skeleton"
 
export function SkeletonCard() {
    return (
      <div className="flex flex-col h-full space-y-3 w-full">
        <Skeleton className="h-1/2 w-full rounded-xl" />
        <Skeleton className="h-1/4 w-full rounded-xl" />
      </div>
    )
  }