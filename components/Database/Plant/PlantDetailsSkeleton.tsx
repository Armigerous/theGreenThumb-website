import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Reason: Optimize skeleton loading for better perceived performance
export default function PlantDetailsSkeleton() {
  return (
    <section className="my-12">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Left Column: Image Gallery Skeleton - Optimized for LCP */}
        <div className="md:w-1/2">
          <div className="relative w-full max-w-3xl h-[500px] bg-cream-100 rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="mt-4 flex gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-24 h-24 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Right Column: Basic Info Skeleton */}
        <div className="md:w-1/2 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4" /> {/* Scientific Name */}
            <Skeleton className="h-6 w-full" /> {/* Genus, Species, Family */}
            <Skeleton className="h-4 w-1/2" /> {/* Phonetic Spelling */}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" /> {/* Common Names Header */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Tags Skeleton */}
      <div className="my-8">
        <Skeleton className="h-6 w-24 mb-4" /> {/* Tags Header */}
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-20" />
          ))}
        </div>
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full h-full grid-cols-2 grid-rows-3 lg:grid-cols-6 lg:grid-rows-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="care">Care</TabsTrigger>
          <TabsTrigger value="garden">Garden</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
