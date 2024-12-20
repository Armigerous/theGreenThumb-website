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

interface Plant {
  slug: string;
  description: string;
  scientificName: string;
  commonName: string;
  tag: string;
  image: {
    img: string;
    altText: string;
    caption: string;
    attribution: string;
  };
}

const PlantCard = ({ plant }: { plant: Plant }) => {
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);

  const imageUrl = plant.image ? plant.image.img : "/no-plant-image.png";

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
      key={plant.slug}
      className="group/card overflow-hidden rounded-xl shadow-md transition-transform text-left"
    >
      <Link href={`/plant/${plant.slug}`}>
        <Image
          src={imageUrl}
          alt={plant.image?.altText || "Plant Image"}
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
            {plant.scientificName}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-1">
            {plant.commonName}
          </CardDescription>
        </Link>
        {plant.tag && (
          <Link href={`/plant/${plant.slug}`}>
            <Badge className="text-cream-50">{plant.tag}</Badge>
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
