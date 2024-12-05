import { Metadata } from "next";
import { fetchAllTipCategories, fetchCategoryBySlug } from "@/lib/utils";
import SearchResults from "@/components/Tips/SearchResults";
import { TipCategory } from "@/types/Tip";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  const { slug } = await params; // Await the params before destructuring
  const category = await fetchCategoryBySlug(slug);
  const title = category?.title || "Category";
  return {
    title: `${title} - Tips & Tricks`,
    description: `Explore gardening tips and tricks in the category: ${title}`,
  };
}

// Define the component for category pages
const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params; // Ensure `params` is accessed correctly

  // Fetch posts and categories
  const categories = await fetchAllTipCategories();
  const categoryDetails =
    slug === "all" ? null : await fetchCategoryBySlug(slug); // Fetch specific category details

  return (
    <main>
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
                <Button variant={"default"} className="text-cream-50">
                  {category.title}
                </Button>
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
