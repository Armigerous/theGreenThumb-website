import Header from "@/components/Database/Header";
import { SimpleSearchBar } from "@/components/Database/Search/SimpleSearchBar";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { Skeleton } from "@/components/ui/skeleton";

// Reason: Optimized loading state that shows static shell immediately with PPR
export default function Loading() {
  return (
    <MaxWidthWrapper className="text-center">
      {/* Static header - prerendered */}
      <Header />

      {/* Static search bar - prerendered */}
      <div className="text-left mx-auto px-8 md:px-0 sm:px-4 mb-8">
        <SimpleSearchBar />
      </div>

      {/* Only show skeleton for dynamic plant results */}
      <div className="text-left mx-auto px-8 md:px-0 sm:px-4">
        <div className="mb-4">
          <Skeleton className="h-8 w-48 md:w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="group/card overflow-hidden rounded-xl shadow-md h-[430px] w-full"
            >
              <div className="relative w-full h-48">
                <Skeleton className="absolute inset-0 w-full h-full" />
              </div>
              <div className="px-5 py-4 space-y-2">
                <div className="space-y-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <div className="px-5">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
              <div className="px-5 py-4 mt-auto">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
