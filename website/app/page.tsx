import { Suspense } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";

// Dynamically import the Homepage component
const Homepage = dynamic(() => import("@/components/Home/Homepage"), {
  loading: () => (
    <div className="animate-pulse space-y-8">
      <div className="h-96 bg-gray-200 rounded" />
      <div className="h-64 bg-gray-200 rounded" />
      <div className="h-48 bg-gray-200 rounded" />
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
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="h-48 bg-gray-200 rounded" />
          </div>
        }
      >
        <Homepage />
      </Suspense>
    </main>
  );
}
