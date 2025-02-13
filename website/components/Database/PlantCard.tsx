"use client";

import { dynamicBlurDataUrl } from "@/lib/dynamicBlurDataUrl";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PlantCardData } from "@/types/plant";

const PlantCard = ({ plant }: { plant: PlantCardData }) => {
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);

  const imageUrl = plant.first_image
    ? plant.first_image
    : "/no-plant-image.png";

  useEffect(() => {
    const fetchBlurDataUrl = async () => {
      if (imageUrl) {
        const blurUrl = await dynamicBlurDataUrl(imageUrl);
        setBlurDataUrl(blurUrl);
      }
    };
    fetchBlurDataUrl();
  }, [imageUrl]);

  return (
    <Card
      key={`${plant.slug}-${plant.scientific_name}`}
      className="group/card overflow-hidden rounded-xl shadow-md transition-transform text-left"
    >
      <Link href={`/plant/${plant.slug}`}>
        <Image
          src={imageUrl || "/no-plant-image.png"}
          alt={plant.first_image_alt_text || `${plant.scientific_name} Image`}
          width={300}
          height={200}
          className="w-full object-cover h-48"
          placeholder="blur"
          blurDataURL={blurDataUrl || "https://placehold.co/600x400"} // Dynamically set blurDataURL
        />
      </Link>

      <CardHeader>
        <Link href={`/plant/${plant.slug}`} className="group/header">
          <CardTitle className="text-lg font-semibold line-clamp-1 group-hover/header:underline">
            {"common_name" in plant
              ? plant.common_name
              : "first_common_name" in plant
                ? plant.scientific_name
                : null}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-1">
            {"common_name" in plant
              ? plant.scientific_name
              : "first_common_name" in plant
                ? plant.first_common_name
                : null}
          </CardDescription>
        </Link>
        {plant.first_tag && (
          <Link href={`/plant/${plant.slug}`}>
            <Badge className="text-cream-50">{plant.first_tag}</Badge>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="text-sm text-muted-foreground md:line-clamp-3 line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(plant.description || "", {
              ALLOWED_TAGS: ["p", "strong", "em", "br", "ul", "li"],
            }),
          }}
        />
      </CardContent>
      <Link href={`/plant/${plant.slug}`}>
        <CardFooter>
          <p className="text-sm text-primary group-hover/card:underline">
            Learn more
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PlantCard;
