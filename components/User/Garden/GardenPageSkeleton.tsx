import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  GardenBasicInfoSkeleton,
  GenericGardenSkeleton,
  GardenStyleSkeleton,
} from "./GardenSkeleton";

export function GardenPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 w-full max-w-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Skeleton className="h-6 w-6 mr-2 rounded-full" /> {/* Icon */}
            <Skeleton className="h-8 w-32" /> {/* Title */}
          </div>
          <Skeleton className="h-10 w-40 sm:w-48" /> {/* Button */}
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Skeleton className="h-5 w-full max-w-2xl mb-6" /> {/* Description */}
          {/* Tabs */}
          <div className="w-full flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-auto gap-2 mb-8 h-full">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" /> /* Tab buttons */
                ))}
            </div>

            {/* Tab content */}
            <GardenBasicInfoSkeleton />

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 mt-8">
              <Skeleton className="h-10 w-28 order-2 sm:order-1 mt-2 sm:mt-0" />{" "}
              {/* Previous button */}
              <Skeleton className="h-10 w-28 order-1 sm:order-2" />{" "}
              {/* Next button */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Garden Insights card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2" /> {/* Icon */}
                  <Skeleton className="h-6 w-36" /> {/* Title */}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Card content with multiple sections */}
              <Skeleton className="h-5 w-full max-w-md" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Skeleton className="h-5 w-5 mr-3 mt-1" /> {/* Icon */}
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-5 w-32" /> {/* Title */}
                        <Skeleton className="h-4 w-full" /> {/* Text */}
                        <Skeleton className="h-2.5 w-full rounded-full" />{" "}
                        {/* Progress bar */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Skeleton className="h-5 w-5 mr-3 mt-1" /> {/* Icon */}
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-5 w-32" /> {/* Title */}
                        <Skeleton className="h-4 w-full" /> {/* Text */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2" /> {/* Icon */}
                  <Skeleton className="h-6 w-36" /> {/* Title */}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function GardenTabContentSkeleton({ activeTab }: { activeTab: string }) {
  // Return different skeletons based on the active tab
  switch (activeTab) {
    case "basic":
      return <GardenBasicInfoSkeleton />;
    case "style":
      return <GardenStyleSkeleton />;
    case "wildlife":
    case "maintenance":
    case "aesthetics":
    case "customization":
    default:
      return <GenericGardenSkeleton />;
  }
}

export function PlantListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 mr-2" /> {/* Icon */}
          <Skeleton className="h-8 w-40" /> {/* Title */}
        </div>
        <Skeleton className="h-9 w-32" /> {/* Add button */}
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Skeleton className="h-10 w-40" /> {/* Filter */}
        <Skeleton className="h-10 w-32" /> {/* Sort */}
        <Skeleton className="h-10 w-48" /> {/* Search */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between p-4 pb-0">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />{" "}
                  {/* Status indicator */}
                  <Skeleton className="h-5 w-32" /> {/* Plant name */}
                </div>
                <Skeleton className="h-8 w-8 rounded-md" /> {/* Menu button */}
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex flex-row gap-4">
                  <Skeleton className="w-20 h-20 rounded-md" /> {/* Image */}
                  <div className="flex-1">
                    <Skeleton className="h-3 w-40 mb-2" />{" "}
                    {/* Botanical name */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array(2)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-5 w-16 rounded-full"
                          /> /* Tags */
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Skeleton className="h-4 w-24" /> {/* Last care */}
                <Skeleton className="h-6 w-20" /> {/* Add care button */}
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}

export function EmptyPlantListSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 mr-2" /> {/* Icon */}
          <Skeleton className="h-8 w-40" /> {/* Title */}
        </div>
        <Skeleton className="h-9 w-32" /> {/* Add button */}
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Skeleton className="h-16 w-16 rounded-full mb-4" /> {/* Icon */}
          <Skeleton className="h-6 w-48 mb-2" /> {/* Title */}
          <Skeleton className="h-4 w-64 mb-6" /> {/* Description */}
          <Skeleton className="h-10 w-40" /> {/* Button */}
        </CardContent>
      </Card>
    </div>
  );
}
