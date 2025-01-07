import { Metadata } from "next";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Tips/Header";
import SearchBar from "@/components/Tips/SearchBar";

export const metadata: Metadata = {
  title: "Expert Gardening Tips - Boost Your Skills with the Best Advice",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/tips`,
  },
  description:
    "Explore expert gardening tips to grow healthier plants, master sustainable gardening, and enhance your horticulture skills. Learn with GreenThumb.",
  keywords: [
    "gardening tips",
    "plant care advice",
    "horticulture tips",
    "gardening tricks",
    "sustainable gardening",
    "how to garden",
    "GreenThumb gardening",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GreenThumb",
    title: "Expert Gardening Tips - Boost Your GreenThumb Skills",
    description:
      "Explore expert gardening tips to grow healthier plants, master sustainable gardening, and enhance your horticulture skills. Learn with GreenThumb.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips`,
    // images: [
    //   {
    //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/tips-og.jpg`,
    //     width: 1200,
    //     height: 630,
    //     alt: "A lush garden with blooming flowers and vegetables - Gardening Tips by GreenThumb",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert Gardening Tips - Boost Your GreenThumb Skills",
    description:
      "Discover practical gardening tips to elevate your horticulture skills. Learn sustainable gardening methods and plant care strategies with GreenThumb.",
    // images: [
    //   {
    //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/tips-twitter.jpg`,
    //     width: 1200,
    //     height: 630,
    //     alt: "GreenThumb Gardening Tips - Practical Advice for All Gardeners",
    //   },
    // ],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    notranslate: false,
    noimageindex: false,
  },
};

export default function TipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Expert Gardening Tips - Boost Your GreenThumb Skills",
    description:
      "Explore expert gardening tips to grow healthier plants, master sustainable gardening, and enhance your horticulture skills. Learn with GreenThumb.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips`,
    mainEntity: {
      "@type": "WebPageElement",
      name: "Gardening Tips Section",
      description: "Practical gardening tips and tricks for all skill levels.",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/tips?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "GreenThumb",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.png`,
      },
    },
  };

  return (
    <MaxWidthWrapper>
      <script
        id="tips-layout-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <Header />
      <SearchBar />
      {children}
    </MaxWidthWrapper>
  );
}
