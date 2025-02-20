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
import { AspectRatio } from "../ui/aspect-ratio";
import { Tip } from "@/types/Tip";
import { Badge } from "../ui/badge";

type TipCardProps = {
  tip: Tip;
  variant?: "default" | "horizontal";
};

const TipCard = ({ tip, variant = "default" }: TipCardProps) => {
  const { slug, title, description, categories, publishedAt, mainImage } = tip;

  return (
    <li className="group h-full">
      <Card
        className={`rounded-xl shadow-md transition-transform text-left h-full overflow-hidden ${
          variant === "horizontal"
            ? "flex flex-col md:flex-row"
            : "flex flex-col"
        }`}
      >
        <Link href={`/tip/${slug?.current}`}>
          {variant === "horizontal" ? (
            <AspectRatio ratio={16 / 9} className="relative md:hidden">
              <Image
                src={mainImage?.asset.url || "/no-plant-image.png"}
                alt={mainImage?.alt || "Tip Image"}
                fill
                className="object-cover"
                priority
              />
            </AspectRatio>
          ) : (
            <AspectRatio ratio={16 / 9} className="bg-muted relative">
              <Image
                src={mainImage?.asset.url || "/no-plant-image.png"}
                alt={mainImage?.alt || "Tip Image"}
                fill
                className="object-cover rounded-t-lg"
                priority
              />
            </AspectRatio>
          )}
        </Link>
        {/* Content Section */}
        <div className={"flex-1 flex flex-col"}>
          <CardHeader>
            {/* Title */}
            <Link href={`/tip/${slug?.current}`}>
              <CardTitle className="text-lg font-bold line-clamp-1 hover:underline">
                {title}
              </CardTitle>
            </Link>
            <CardDescription>
              {/* Date and Categories */}
              <div className="flex flex-row justify-between items-center mb-3">
                <span className="text-sm text-muted-foreground">
                  {formatDate(publishedAt)}
                </span>
                <div className="flex space-x-2">
                  {categories?.map((category) => (
                    <Link
                      key={category.slug.current}
                      href={`/tips/category/${category.slug.current}`}
                    >
                      <Badge
                        variant="default"
                        className="text-cream-50 text-center"
                      >
                        {category.title}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {description ? (
              <p className="text-sm text-muted-foreground line-clamp-2 lg:line-clamp-3">
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
        </div>
      </Card>
    </li>
  );
};

export default TipCard;
