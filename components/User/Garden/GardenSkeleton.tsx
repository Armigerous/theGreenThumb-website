import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function GardenBasicInfoSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Garden Name */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-32" /> {/* Label */}
              <Skeleton className="h-5 w-64" /> {/* Description */}
              <Skeleton className="h-4 w-full max-w-md" /> {/* Help text */}
            </div>
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NC Region */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-32" /> {/* Label */}
                <Skeleton className="h-5 w-64" /> {/* Description */}
                <Skeleton className="h-4 w-full max-w-md" /> {/* Help text */}
              </div>
              <Skeleton className="h-10 w-full" /> {/* Select */}
            </div>

            {/* USDA Zone */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-32" /> {/* Label */}
                <Skeleton className="h-5 w-64" /> {/* Description */}
                <Skeleton className="h-4 w-full max-w-md" /> {/* Help text */}
              </div>
              <Skeleton className="h-10 w-full" /> {/* Select */}
            </div>
          </div>

          {/* Light Requirements */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" /> {/* Label */}
              <Skeleton className="h-5 w-64" /> {/* Description */}
              <Skeleton className="h-4 w-full max-w-md" /> {/* Help text */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3">
              {/* Checkboxes */}
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                    <Skeleton className="h-4 w-24" /> {/* Label */}
                  </div>
                ))}
            </div>
          </div>

          {/* Soil Profile */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-32" /> {/* Label */}
              <Skeleton className="h-5 w-64" /> {/* Description */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3">
              {/* Checkboxes */}
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                    <Skeleton className="h-4 w-24" /> {/* Label */}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GardenStyleSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Garden Location */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" /> {/* Label */}
              <Skeleton className="h-5 w-64" /> {/* Description */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3">
              {/* Checkboxes */}
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                    <Skeleton className="h-4 w-32" /> {/* Label */}
                  </div>
                ))}
            </div>
          </div>

          {/* Garden Theme */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" /> {/* Label */}
              <Skeleton className="h-5 w-64" /> {/* Description */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3">
              {/* Checkboxes */}
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                    <Skeleton className="h-4 w-36" /> {/* Label */}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Generic skeleton that can be used for other tabs with similar structure
export function GenericGardenSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" /> {/* Label */}
              <Skeleton className="h-5 w-64" /> {/* Description */}
              <Skeleton className="h-4 w-full max-w-md" /> {/* Help text */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3">
              {/* Checkboxes */}
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                    <Skeleton className="h-4 w-32" /> {/* Label */}
                  </div>
                ))}
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" /> {/* Label */}
              <Skeleton className="h-5 w-64" /> {/* Description */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3">
              {/* Checkboxes */}
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                    <Skeleton className="h-4 w-36" /> {/* Label */}
                  </div>
                ))}
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" /> {/* Label */}
              <Skeleton className="h-5 w-64" /> {/* Description */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <Skeleton className="h-10 w-full" /> {/* Select */}
              <Skeleton className="h-10 w-full" /> {/* Select */}
              <Skeleton className="h-10 w-full" /> {/* Select */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
