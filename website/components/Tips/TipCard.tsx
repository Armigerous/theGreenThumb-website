import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const TipCard = ({ tip }: { tip: TipCardType }) => {
  const { _id, slug, title, description, categories, publishedAt, mainImage } =
    tip;

  return (
    <li className="group">
      <Card className="rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105 text-left">
        {/* Image Section */}
        <Link href={`/tip/${slug?.current}`}>
          <Image
            src={mainImage?.asset.url || "/no-plant-image.png"}
            alt={mainImage?.alt || "Tip Image"}
            width={600}
            height={300}
            className="w-full h-48 object-cover"
          />
        </Link>

        <CardHeader>
          {/* Title */}
          <Link href={`/tip/${slug?.current}`}>
            <CardTitle className="text-lg font-bold line-clamp-2 hover:underline">
              {title}
            </CardTitle>
          </Link>
          <CardDescription>
            {/* Date and Category */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">
                {formatDate(publishedAt)}
              </span>
              {categories?.[0] && (
                <Link href={`tips/category/${categories[0].slug.current}`}>
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                    {categories[0].title}
                  </span>
                </Link>
              )}
            </div>
          </CardDescription>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="line-clamp-3">
          {description ? (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No content available.
            </p>
          )}
        </CardContent>

        {/* Footer Section */}
        <CardFooter>
          <Link href={`/tip/${slug?.current}`}>
            <span className="text-sm text-primary font-medium group-hover:underline flex items-center">
              Read more <span className="ml-1">→</span>
            </span>
          </Link>
        </CardFooter>
      </Card>
    </li>
  );
};

export default TipCard;
