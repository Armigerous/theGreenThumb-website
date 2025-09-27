import { Suspense } from "react";
import dynamic from "next/dynamic";

// Reason: Dynamic import for client component that needs to be hydrated on the client
const Autocomplete = dynamic(
  () => import("./Autocomplete").then((mod) => ({ default: mod.Autocomplete })),
  {
    // Reason: Enable SSR for PPR - the component will be prerendered on server and hydrated on client
    ssr: true,
    loading: () => (
      <div className="h-14 bg-gray-100 animate-pulse rounded-lg" />
    ),
  }
);

// Reason: Server component for static shell that will be prerendered with PPR
export function StaticSearchShell() {
  return (
    <div className="text-left mx-auto px-8 md:px-0 sm:px-4">
      {/* Static search bar - prerendered */}
      <Suspense
        fallback={<div className="h-14 bg-gray-100 animate-pulse rounded-lg" />}
      >
        <Autocomplete />
      </Suspense>
    </div>
  );
}
