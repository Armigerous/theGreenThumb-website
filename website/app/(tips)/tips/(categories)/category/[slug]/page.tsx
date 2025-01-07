import { Metadata } from "next";
import { fetchAllTipCategories, fetchCategoryBySlug } from "@/lib/utils";
import SearchResults from "@/components/Tips/SearchResults";
import { TipCategory } from "@/types/Tip";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Generate static paths for categories
export async function generateStaticParams() {
  const categories = await fetchAllTipCategories();
  const paths = categories.map((category: TipCategory) => ({
    slug: category.slug.current,
  }));
  return paths;
}

// Generate metadata for the category page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const category = await fetchCategoryBySlug(slug);

  const title = category?.title || "Category";
  const description =
    category?.description ||
    `Explore a wide range of tips in the ${title} category.`;

  return {
    title: `${title} - Gardening Tips & Tricks | The GreenThumb`,
    description,
    keywords: [
      title,
      "gardening tips",
      "horticulture tips",
      `${title} tricks`,
      "GreenThumb gardening",
    ],
    openGraph: {
      title: `${title} - Gardening Tips & Tricks | GreenThumb`,
      description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips/category/${slug}`,
      // images: [
      //   {
      //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/categories/${slug}-og.jpg`,
      //     width: 1200,
      //     height: 630,
      //     alt: `${title} category overview image`,
      //   },
      // ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Gardening Tips & Tricks`,
      description,
      // images: [
      //   {
      //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/categories/${slug}-twitter.jpg`,
      //     width: 1200,
      //     height: 630,
      //     alt: `${title} category overview`,
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
}

// Define the component for category pages
const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // Fetch posts and categories
  const categories = await fetchAllTipCategories();
  const categoryDetails =
    slug === "all" ? null : await fetchCategoryBySlug(slug); // Fetch specific category details

  // JSON-LD data for structured markup
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: categoryDetails?.title || "Category",
    description:
      categoryDetails?.description ||
      "Explore a curated collection of tips and tricks.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips/category/${slug}`,
    hasPart: categories.map((cat: TipCategory) => ({
      "@type": "WebPage",
      name: cat.title,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/tips/category/${cat.slug.current}`,
    })),
  };

  return (
    <main>
      <script
        id="category-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className="container mx-auto py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-cream-800">
            {categoryDetails?.title || "Category"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {categoryDetails?.description || "Explore this category."}
          </p>
        </header>
        <section className="mb-6">
          <div className="flex items-end">
            <h2 className="text-xl font-semibold">Browse Categories</h2>
            <Link
              href={"/tips/categories"}
              className="hover:underline text-primary pl-2"
            >
              <p>View All</p>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {categories.map((category: TipCategory) => (
              <Link
                key={category.slug.current}
                href={`/tips/category/${category.slug.current}`}
              >
                <Badge className="text-cream-50">{category.title}</Badge>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <SearchResults query={slug} page={1} />
          {/* Replace with appropriate page handling */}
        </section>
      </div>
    </main>
  );
};

export default CategoryPage;
