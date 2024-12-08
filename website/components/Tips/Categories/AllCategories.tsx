import { Heading } from "@/components/heading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchAllTipCategories } from "@/lib/utils";
import { TipCategory } from "@/types/Tip";
import Link from "next/link";
import SearchCategories from "./SearchCategories";

const AllCategories = async () => {
  const categories = await fetchAllTipCategories();

  return (
    <div className="container mx-auto ">
      <div className="flex justify-between my-4">
        <Heading className="text-left overflow-visible w-full md:w-auto my-2">
          Categories
        </Heading>
        <SearchCategories categories={categories} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category: TipCategory) => (
          <Card
            key={category._id}
            className="rounded-xl shadow-md transition-transform text-left group"
          >
            <Link href={category.slug.current}>
              <CardHeader className="flex justify-between pb-0">
                <CardTitle className="line-clamp-1 hover:underline">
                  {category.title}
                </CardTitle>
              </CardHeader>
            </Link>
            <CardContent className="line-clamp-2 pt-0">
              {category.description}
            </CardContent>
            <Link href={category.slug.current}>
              <CardFooter>
                <span className="text-sm text-primary font-medium group-hover:underline flex items-center">
                  Read more <span className="ml-1">→</span>
                </span>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllCategories;
