import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function CourseSkeletonCard() {
  return (
    <Card className="flex flex-col overflow-hidden border-gray-200 h-full">
      {/* Image Skeleton */}
      <div className="w-full aspect-video">
        <Skeleton className="w-full h-full rounded-none bg-gray-200 animate-pulse" />
      </div>

      <CardContent className="grow p-5 space-y-3">
        {/* Title Skeleton (2 lines) */}
        <Skeleton className="h-6 w-3/4 bg-gray-200 animate-pulse" />
        <Skeleton className="h-6 w-1/2 bg-gray-200 animate-pulse" />

        {/* Description/Meta Skeleton */}
        <div className="pt-2 space-y-2">
          <Skeleton className="h-4 w-full bg-gray-100 animate-pulse" />
          <Skeleton className="h-4 w-2/3 bg-gray-100 animate-pulse" />
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        {/* Price Skeleton */}
        <Skeleton className="h-8 w-20 bg-gray-200 animate-pulse" />
        {/* Button/Action Skeleton */}
        <Skeleton className="h-4 w-24 bg-gray-100 animate-pulse" />
      </CardFooter>
    </Card>
  );
}
