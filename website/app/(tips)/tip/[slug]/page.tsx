import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Tips/Tip/Header";
import Tip from "@/components/Tips/Tip/Tip";
import TipDetails from "@/components/Tips/Tip/TipDetails";
import { fetchAllTipSlugs, fetchTipBySlug } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await fetchAllTipSlugs();
  return slugs.map(({ slug }) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const tip = await fetchTipBySlug(slug);

  if (!tip) {
    return { title: "Tip Not Found" };
  }

  const { title, description, image } = tip;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}tips/${slug}`;

  return {
    title,
    description,
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
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const TipPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  const tip = await fetchTipBySlug(slug);

  if (!tip) {
    notFound();
  }

  // Dynamic Metadata
  const { title, description, image, author, datePublished, dateModified } =
    tip;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    author: {
      "@type": "Person",
      name: author || "Default Author", // Replace with dynamic or default author name
    },
    publisher: {
      "@type": "Organization",
      name: "The GreenThumb", // Replace with your site name
      logo: {
        "@type": "ImageObject",
        url: "/logo.png", // Replace with your logo URL
      },
    },
    url: `${process.env.NEXT_PUBLIC_BASE_URL}tips/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
  };

  return (
    <MaxWidthWrapper className="scroll-smooth">
      <script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Add SEO metadata */}
      <article>
        <Header tip={tip} />
        <TipDetails tip={tip} />
        <Tip tip={tip} />
      </article>
    </MaxWidthWrapper>
  );
};

export default TipPage;
