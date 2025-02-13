import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Tips/Tip/Header";
import Tip from "@/components/Tips/Tip/Tip";
import TipDetails from "@/components/Tips/Tip/TipDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllTipSlugs, fetchTipBySlug } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

// Revalidate every 24 hours for ISR
export const revalidate = 86400;

// Generate static paths for all tips
export async function generateStaticParams() {
  const slugs = await fetchAllTipSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

// Cache the tip data fetch function (similar to plant page caching)
const getTipData = unstable_cache(
  async (slug: string) => {
    const tip = await fetchTipBySlug(slug);
    if (!tip) {
      throw new Error("Tip not found");
    }
    return tip;
  },
  ["tip-data"],
  {
    revalidate: 86400,
    tags: ["tips"],
  }
);

// Generate metadata for a specific tip page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const slug = (await params).slug;
    const tip = await getTipData(slug);

    const { title, image } = tip;
    const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/tips/${slug}`;

    const description = tip.description
      ? `${tip.description.slice(0, 150)}...`
      : "Learn about plant care, growth, and maintenance with expert tips from The GreenThumb.";

    return {
      title,
      description,
      keywords: [
        title,
        "gardening tips",
        "horticulture advice",
        "plant care tips",
        "The GreenThumb",
        "home gardening",
        "organic gardening",
        "plant maintenance",
        "beginner gardening",
        "garden planning",
        "sustainable gardening",
        "how to grow plants",
        "garden hacks",
        "DIY gardening",
      ],
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Tip Not Found",
      description: "The tip you are looking for could not be found.",
      robots: { index: false, follow: false },
    };
  }
}

// Tip page skeleton as fallback while data is loading
const TipSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-black/40 rounded-lg" />
    </div>

    {/* Tip Details Skeleton */}
    <div className="py-2 my-10 flex items-center border-2 justify-around flex-wrap font-medium rounded-lg text-lg sm:text-xl px-2 md:px-10 bg-primary text-cream-50 border-cream-800">
      <Skeleton className="h-6 w-32" /> {/* Date */}
      <Skeleton className="h-6 w-16" /> {/* Views */}
      <Skeleton className="h-6 w-20" /> {/* Read Time */}
      <Skeleton className="h-6 w-24" /> {/* Category */}
    </div>

    {/* Tip Layout */}
    <div className="flex flex-col md:flex-row gap-4">
      {/* Table of Contents Skeleton */}
      <div className="md:w-1/4 order-1 md:order-none">
        <Skeleton className="h-8 w-40 mb-4" /> {/* TOC Title */}
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-6 w-28 mb-2" />
        <Skeleton className="h-6 w-24 mb-2" />
      </div>

      {/* Tip Content Skeleton */}
      <div className="md:w-3/4 order-2 space-y-4">
        <Skeleton className="h-8 w-3/4 mb-4" /> {/* Title */}
        <Skeleton className="h-64 w-full mb-4" /> {/* Main Image */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
      </div>
    </div>
  </div>
);

interface TipData {
  title: string;
  description: string;
  image: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
}

// Extracted component for structured data (JSON‑LD) injection
const TipStructuredData = ({ tip }: { tip: TipData }) => {
  const {
    title,
    description,
    image,
    author = "Eren Kahveci",
    datePublished,
    dateModified,
  } = tip;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: "The GreenThumb",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
      },
    },
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips/${tip.slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
  };

  return (
    <script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

// Tip page content – fetches the tip and renders its components
const TipPageContent = async ({ slug }: { slug: string }) => {
  let tip;
  try {
    tip = await getTipData(slug);
  } catch (error) {
    console.error("Error fetching tip data:", error);
    notFound();
  }

  return (
    <>
      <TipStructuredData tip={tip} />
      <article>
        <Header tip={tip} />
        <TipDetails tip={tip} />
        <Tip tip={tip} />
      </article>
    </>
  );
};

// Main tip page component
const TipPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return (
    <MaxWidthWrapper className="scroll-smooth">
      <Suspense fallback={<TipSkeleton />}>
        <TipPageContent slug={slug} />
      </Suspense>
    </MaxWidthWrapper>
  );
};

export default TipPage;
