import { Skeleton } from "@/components/ui/skeleton";

// Reason: Specific loading component for homepage to provide better UX during navigation
export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col md:flex-row w-full h-auto md:h-screen justify-between items-center md:pb-20 pb-0 px-4">
        <div className="text-left md:w-1/2 mb-6 md:mb-0 pt-20 lg:pt-0 space-y-6">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-16 md:h-20 w-full" />
          <Skeleton className="h-6 md:h-8 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
          <Skeleton className="h-96 w-96 rounded-full" />
        </div>
      </div>

      {/* Parallax Skeleton */}
      <div className="w-screen h-screen bg-cream-100 flex items-center justify-center">
        <Skeleton className="h-16 w-64" />
      </div>

      {/* Product Features Skeleton */}
      <div className="relative m-5">
        <div className="max-w-screen-xl mx-auto">
          <div className="sticky top-[2vh] pt-14 lg:pt-16 text-cream-800 mb-36">
            <Skeleton className="h-16 w-96 mx-auto" />
          </div>
          <div className="flex flex-col gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-10 lg:py-16">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-12">
                  <Skeleton className="h-80 w-full max-w-[400px]" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Features Skeleton */}
      <div className="h-auto lg:h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="max-w-screen-xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Skeleton className="h-24 w-72" />
            <Skeleton className="h-20 w-64" />
          </div>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full sm:w-[30%] h-64 border rounded-lg p-4 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
