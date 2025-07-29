import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FadeInWrapper,
  StaggeredList,
} from "@/components/ui/loading-animation";

export default function PlantsLoading() {
  return (
    <MaxWidthWrapper className="text-center">
      {/* Header Skeleton - matches the exact Header component structure */}
      <FadeInWrapper delay={150}>
        <div className="relative">
          {/* Image skeleton - matches OptimizedImage dimensions exactly */}
          <Skeleton className="w-full h-[550px] rounded-lg bg-muted" />

          {/* Overlay content skeleton - matches the exact positioning and structure */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
            <div className="bg-cream-300 bg-opacity-70 p-4 md:p-6 rounded-lg">
              <Skeleton className="h-16 w-48 md:w-64 mb-2 bg-muted" />
              <Skeleton className="h-6 w-64 md:w-80 bg-muted" />
            </div>
          </div>
        </div>
      </FadeInWrapper>

      {/* Search and Results Skeleton */}
      <FadeInWrapper delay={300}>
        <div className="text-left mx-auto px-8 md:px-0 sm:px-4">
          {/* Search Input Skeleton */}
          <div className="mb-6">
            <Skeleton className="w-full max-w-screen-sm h-12 rounded-lg bg-muted" />
          </div>

          {/* Results Header Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-8 w-48 md:w-64 mb-2 bg-muted" />
            <Skeleton className="h-4 w-32 bg-muted" />
          </div>

          {/* Plant Cards Grid Skeleton with staggered animation */}
          <StaggeredList
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            staggerDelay={100}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="group/card overflow-hidden rounded-xl shadow-md transition-transform text-left h-[430px] w-full flex flex-col"
              >
                {/* Image Skeleton */}
                <Skeleton className="w-full h-48 object-cover rounded-t-xl bg-muted" />

                {/* Header Section */}
                <div className="px-5 py-4 space-y-2">
                  <Skeleton className="h-6 w-3/4 rounded-md bg-muted" />
                  <Skeleton className="h-4 w-1/2 rounded-md bg-muted" />
                  <Skeleton className="h-5 w-24 rounded-full bg-muted" />
                </div>

                {/* Content Section */}
                <div className="px-5 space-y-2 flex-grow">
                  <Skeleton className="h-4 w-full rounded-md bg-muted" />
                  <Skeleton className="h-4 w-5/6 rounded-md bg-muted" />
                  <Skeleton className="h-4 w-4/6 rounded-md bg-muted" />
                </div>

                {/* Footer Section */}
                <div className="px-5 py-4 mt-auto">
                  <Skeleton className="h-4 w-20 rounded-md bg-muted" />
                </div>
              </div>
            ))}
          </StaggeredList>

          {/* Pagination Skeleton */}
          <FadeInWrapper delay={1200}>
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-10 rounded-md bg-muted" />
                <Skeleton className="h-10 w-10 rounded-md bg-muted" />
                <Skeleton className="h-10 w-10 rounded-md bg-muted" />
                <Skeleton className="h-10 w-10 rounded-md bg-muted" />
                <Skeleton className="h-10 w-10 rounded-md bg-muted" />
              </div>
            </div>
          </FadeInWrapper>
        </div>
      </FadeInWrapper>
    </MaxWidthWrapper>
  );
}
