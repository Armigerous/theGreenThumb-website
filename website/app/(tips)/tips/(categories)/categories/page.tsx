import AllCategories from "@/components/Tips/Categories/AllCategories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gardening Categories - Tips & Tricks",
  description:
    "Browse through all gardening tips categories to enhance your gardening skills.",
  openGraph: {
    title: "Gardening Categories - Tips & Tricks",
    description:
      "Explore gardening tips categories for all levels of expertise.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips/categories`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/categories-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Gardening Categories Overview",
      },
    ],
  },
};

const CategoriesPage = () => {
  return <AllCategories />;
};

export default CategoriesPage;
