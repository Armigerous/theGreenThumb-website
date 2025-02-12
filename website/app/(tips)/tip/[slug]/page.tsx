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
    const { slug } = await params;
    const tip = await getTipData(slug);

    const { title, description, image } = tip;
    const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/tips/${slug}`;

    return {
      title,
      description,
      keywords: [
        title,
        "gardening tips",
        "horticulture advice",
        "plant care tips",
        "The GreenThumb",
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
    <div className="space-y-4">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>

    {/* TipDetails Skeleton */}
    <div className="flex gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>

    {/* Tip Content Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
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
