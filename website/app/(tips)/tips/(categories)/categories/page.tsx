import AllCategories from "@/components/Tips/Categories/AllCategories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gardening Categories - Explore Tips & Tricks",
  description:
    "Browse through all gardening tips categories to master plant care, horticulture, and sustainable gardening techniques.",
  keywords: [
    "gardening tips",
    "gardening categories",
    "plant care",
    "horticulture tips",
    "sustainable gardening",
    "gardening advice",
  ],
  openGraph: {
    title: "Gardening Categories - Explore Tips & Tricks",
    description:
      "Explore gardening tips categories designed for all levels of expertise, from beginners to advanced horticulturists.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips/categories`,
    // images: [
    //   {
    //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/categories-og.jpg`,
    //     width: 1200,
    //     height: 630,
    //     alt: "Overview of Gardening Categories - Tips and Tricks",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gardening Categories - Tips & Tricks",
    description:
      "Discover gardening categories packed with practical tips for beginners and experts alike. Start enhancing your gardening skills today!",
    // images: [
    //   {
    //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/categories-twitter.jpg`,
    //     width: 1200,
    //     height: 630,
    //     alt: "Gardening Tips and Categories Overview",
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

const CategoriesPage = () => {
  // JSON-LD structured data for the Categories page
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gardening Categories - Tips & Tricks",
    description:
      "Browse through all gardening tips categories to master plant care, horticulture, and sustainable gardening techniques.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips/categories`,
  };

  return (
    <main>
      <script
        id="categories-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <AllCategories />
    </main>
  );
};

export default CategoriesPage;
