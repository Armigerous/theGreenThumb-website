import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Tips/Tip/Header";
import Tip from "@/components/Tips/Tip/Tip";
import TipDetails from "@/components/Tips/Tip/TipDetails";
import { fetchAllTipSlugs, fetchTipBySlug } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Generate static paths for all tips
export async function generateStaticParams() {
  const slugs = await fetchAllTipSlugs();
  return slugs.map(({ slug }) => ({
    slug,
  }));
}

// Generate metadata for a specific tip page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const tip = await fetchTipBySlug(slug);

  if (!tip) {
    return {
      title: "Tip Not Found",
      description: "The tip you are looking for could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

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
}

const TipPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const tip = await fetchTipBySlug(slug);

  if (!tip) {
    notFound();
  }

  const {
    title,
    description,
    image,
    author = "Eren Kahveci", // Provide a fallback author
    datePublished,
    dateModified,
  } = tip;

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "The GreenThumb",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
      },
    },
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
  };

  return (
    <MaxWidthWrapper className="scroll-smooth">
      {/* Add JSON-LD structured data */}
      <script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main content */}
      <article>
        <Header tip={tip} />
        <TipDetails tip={tip} />
        <Tip tip={tip} />
      </article>
    </MaxWidthWrapper>
  );
};

export default TipPage;
