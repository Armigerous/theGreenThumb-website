import { Metadata } from "next";
import { FilterPanel } from "@/components/Database/Filter/FilterPanel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { allFilters } from "@/types/filterData";

export const metadata: Metadata = {
  title: "Explore Plants Database with Advanced Filters - GreenThumb",
  description:
    "Explore our comprehensive plants database with advanced filters for gardening and horticulture enthusiasts.",
  keywords: [
    "plants database",
    "gardening plants",
    "horticulture plants",
    "GreenThumb plants",
    "gardening resources",
  ],
  openGraph: {
    title: "Explore Plants Database with Advanced Filters - GreenThumb",
    description:
      "Explore our comprehensive plants database with advanced filters for all your gardening needs.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/plants`,
    // images: [
    //   {
    //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/plants-og.jpg`,
    //     width: 1200,
    //     height: 630,
    //     alt: "Preview of the Plants Database",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plants Database - GreenThumb",
    description:
      "Explore our comprehensive plants database with advanced filters for all your gardening needs.",
    // images: [
    //   {
    //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/plants-twitter.jpg`,
    //     width: 1200,
    //     height: 630,
    //     alt: "Plants Database overview",
    //   },
    // ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/plants`,
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

export default function PlantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dynamically generate the ItemList structured data from allFilters
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Plants Database",
    description:
      "Explore our comprehensive plants database with advanced filters for gardening and horticulture enthusiasts.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/plants`,
    hasPart: allFilters.map((section, index) => ({
      "@type": "ItemList",
      name: section.name,
      position: index + 1,
      itemListElement: section.categories.map((category, catIndex) => ({
        "@type": "ListItem",
        position: catIndex + 1,
        name: category.name,
      })),
    })),
  };

  return (
    <main>
      {/* JSON-LD Structured Data */}
      <script
        id="plants-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SidebarProvider>
        <FilterPanel />
        {children}
      </SidebarProvider>
    </main>
  );
}
