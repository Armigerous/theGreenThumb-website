import { Suspense } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Skeleton } from "@/components/ui/skeleton";
import { getLogoPath } from "@/lib/utils";

// Dynamically import the Homepage component
const Homepage = dynamic(() => import("@/components/Home/Homepage"), {
  loading: () => (
    <div className="space-y-0">
      {/* Hero Section - Full screen height on desktop, accounting for navbar */}
      <section id="Home" className="w-full">
        <main>
          <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-20">
            <div className="flex flex-col md:flex-row w-full h-auto md:h-screen justify-between items-center md:pb-20 pb-0">
              {/* Text Content */}
              <div className="text-left md:w-1/2 mb-6 md:mb-0 pt-20 lg:pt-0 px-4 space-y-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-12 w-full mt-6" />
              </div>
              {/* Model/Image */}
              <div className="pointer-events-none w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
                <Skeleton className="h-64 w-64 rounded-lg" />
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Parallax Section - Full screen height */}
      <section>
        <div className="w-screen h-screen relative flex items-center justify-center overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      </section>

      {/* Product Features Section - Variable height with proper container */}
      <section id="ProductFeatures">
        <div className="relative m-5">
          <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-20">
            <div className="sticky top-[2vh] pt-14 lg:pt-16 text-cream-800 mb-36">
              <Skeleton className="h-16 w-64 mx-auto" />
            </div>
            <div className="flex flex-col gap-10">
              {[1, 2, 3].map((i) => (
                <section key={i} className="py-10 lg:py-16">
                  <div className="flex flex-col lg:flex-row items-center justify-center h-auto w-full overflow-visible gap-10 lg:gap-12">
                    {/* Animation Block */}
                    <div className="flex-1 flex justify-center w-full">
                      <Skeleton className="h-64 w-full max-w-[400px] rounded-3xl" />
                    </div>
                    {/* Text Content Block */}
                    <div className="flex-1 flex flex-col gap-5 lg:gap-7 text-left">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Section - Full screen height */}
      <section>
        <div className="w-screen h-screen relative flex items-center justify-center overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      </section>

      {/* App Features Section - Full screen height on desktop with proper container */}
      <section id="AppFeatures">
        <div className="h-auto lg:h-screen flex flex-col justify-center items-center overflow-hidden">
          <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-20">
            <div className="mt-[8vh] flex flex-col sm:flex-row sm:self-end items-center pr-1 sm:pr-0 text-center sm:text-right text-cream-600 text-md sm:text-2xl font-light">
              <Skeleton className="h-6 w-64" />
            </div>
            <div className="flex flex-col items-center text-left flex-grow justify-center">
              <div className="mb-16 sm:mb-28">
                <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                  <Skeleton className="w-48 sm:w-72 h-14 sm:h-24 rounded-xl" />
                  <Skeleton className="h-12 sm:h-20 w-64 sm:w-96" />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-5 mt-5">
                  <Skeleton className="h-12 sm:h-20 w-64 sm:w-96" />
                  <Skeleton className="w-48 sm:w-72 h-16 sm:h-20 rounded-xl" />
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-between gap-5 sm:gap-8 my-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full sm:w-[30%] h-48">
                    <Skeleton className="h-full w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
});

export default function Home() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The GreenThumb",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    logo: getLogoPath("social"),
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
          <div className="space-y-0">
            {/* Hero Section - Full screen height on desktop, accounting for navbar */}
            <section id="Home" className="w-full">
              <main>
                <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-20">
                  <div className="flex flex-col md:flex-row w-full h-auto md:h-screen justify-between items-center md:pb-20 pb-0">
                    {/* Text Content */}
                    <div className="text-left md:w-1/2 mb-6 md:mb-0 pt-20 lg:pt-0 px-4 space-y-6">
                      <Skeleton className="h-6 w-48 mb-4" />
                      <Skeleton className="h-16 w-full mb-4" />
                      <Skeleton className="h-8 w-3/4 mb-4" />
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center">
                            <Skeleton className="h-4 w-4 mr-2" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        ))}
                      </div>
                      <Skeleton className="h-12 w-full mt-6" />
                    </div>
                    {/* Model/Image */}
                    <div className="pointer-events-none w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
                      <Skeleton className="h-64 w-64 rounded-lg" />
                    </div>
                  </div>
                </div>
              </main>
            </section>

            {/* Parallax Section - Full screen height */}
            <section>
              <div className="w-screen h-screen relative flex items-center justify-center overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            </section>

            {/* Product Features Section - Variable height with proper container */}
            <section id="ProductFeatures">
              <div className="relative m-5">
                <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-20">
                  <div className="sticky top-[2vh] pt-14 lg:pt-16 text-cream-800 mb-36">
                    <Skeleton className="h-16 w-64 mx-auto" />
                  </div>
                  <div className="flex flex-col gap-10">
                    {[1, 2, 3].map((i) => (
                      <section key={i} className="py-10 lg:py-16">
                        <div className="flex flex-col lg:flex-row items-center justify-center h-auto w-full overflow-visible gap-10 lg:gap-12">
                          {/* Animation Block */}
                          <div className="flex-1 flex justify-center w-full">
                            <Skeleton className="h-64 w-full max-w-[400px] rounded-3xl" />
                          </div>
                          {/* Text Content Block */}
                          <div className="flex-1 flex flex-col gap-5 lg:gap-7 text-left">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-10 w-32" />
                          </div>
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Parallax Section - Full screen height */}
            <section>
              <div className="w-screen h-screen relative flex items-center justify-center overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            </section>

            {/* App Features Section - Full screen height on desktop with proper container */}
            <section id="AppFeatures">
              <div className="h-auto lg:h-screen flex flex-col justify-center items-center overflow-hidden">
                <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-20">
                  <div className="mt-[8vh] flex flex-col sm:flex-row sm:self-end items-center pr-1 sm:pr-0 text-center sm:text-right text-cream-600 text-md sm:text-2xl font-light">
                    <Skeleton className="h-6 w-64" />
                  </div>
                  <div className="flex flex-col items-center text-left flex-grow justify-center">
                    <div className="mb-16 sm:mb-28">
                      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                        <Skeleton className="w-48 sm:w-72 h-14 sm:h-24 rounded-xl" />
                        <Skeleton className="h-12 sm:h-20 w-64 sm:w-96" />
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-5 mt-5">
                        <Skeleton className="h-12 sm:h-20 w-64 sm:w-96" />
                        <Skeleton className="w-48 sm:w-72 h-16 sm:h-20 rounded-xl" />
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-between gap-5 sm:gap-8 my-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-full sm:w-[30%] h-48">
                          <Skeleton className="h-full w-full rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        }
      >
        <Homepage />
      </Suspense>
    </main>
  );
}
