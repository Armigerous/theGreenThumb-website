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
        className={`rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105 text-left h-full ${
          variant === "horizontal" ? "flex" : "flex flex-col"
        }`}
      >
        {/* Image Section */}
        <Link href={`/tip/${slug?.current}`}>
          {variant === "horizontal" ? (
            <div className="flex inset-0 w-full h-full">
              <Image
                src={mainImage?.asset.url || "/no-plant-image.png"}
                alt={mainImage?.alt || "Tip Image"}
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
          ) : (
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <Image
                src={mainImage?.asset.url || "/no-plant-image.png"}
                alt={mainImage?.alt || "Tip Image"}
                fill
                className="object-cover"
              />
            </AspectRatio>
          )}
        </Link>

        {/* Content Section */}
        <div
          className={`${
            variant === "horizontal"
              ? "flex-shrink-0 basis-[55%] h-full"
              : "flex-1 flex flex-col"
          }`}
        >
          <CardHeader>
            {/* Title */}
            <Link href={`/tip/${slug?.current}`}>
              <CardTitle className="text-lg font-bold line-clamp-2 hover:underline">
                {title}
              </CardTitle>
            </Link>
            <CardDescription>
              {/* Date and Categories */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-muted-foreground">
                  {formatDate(publishedAt)}
                </span>
                <div className="flex space-x-2">
                  {categories?.map((category) => (
                    <Link
                      key={category.slug.current}
                      href={`/tips/category/${category.slug.current}`}
                    >
                      <Badge variant="default" className="text-cream-50">
                        {category.title}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="line-clamp-3 flex-1">
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
        </div>
      </Card>
    </li>
  );
};

export default TipCard;
