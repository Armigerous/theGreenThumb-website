import { Metadata } from "next";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Tips/Header";
import SearchBar from "@/components/Tips/SearchBar";

export const metadata: Metadata = {
  title: "Gardening Tips - GreenThumb",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/tips`,
  },
  description:
    "Discover valuable gardening tips and tricks to enhance your skills.",
  openGraph: {
    title: "Gardening Tips - GreenThumb",
    description:
      "Discover valuable gardening tips and tricks to enhance your skills.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/tips-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Gardening Tips Overview",
      },
    ],
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
    name: "Gardening Tips - GreenThumb",
    description:
      "Discover valuable gardening tips and tricks to enhance your skills.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips`,
    mainEntity: {
      "@type": "WebPageElement",
      name: "Gardening Tips Section",
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
