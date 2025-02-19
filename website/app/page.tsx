import { Suspense } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the Homepage component
const Homepage = dynamic(() => import("@/components/Home/Homepage"), {
  loading: () => (
    <div className="space-y-8">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  ),
});

export default function Home() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The GreenThumb",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    logo: "/logo.png",
    description:
      "Merging the worlds of technology and agriculture for happier gardeners.",
  };

  return (
    <main>
      <Script
        id="json-ld-the-green-thumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <Suspense
        fallback={
          <div className="space-y-8">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        }
      >
        <Homepage />
      </Suspense>
    </main>
  );
}
