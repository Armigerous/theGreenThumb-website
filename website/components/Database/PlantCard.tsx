"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { PlantSummary } from "@/types/plantsList";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "../ui/badge";
import { dynamicBlurDataUrl } from "@/lib/dynamicBlurDataUrl";

const PlantCard = ({ plant }: { plant: PlantSummary }) => {
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);

  const imageUrl =
    plant.plantimage_set && plant.plantimage_set.length > 0
      ? plant.plantimage_set[0].img
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

  const firstTag = plant.tags?.[0];

  return (
    <Card
      key={plant.slug}
      className="group/card overflow-hidden rounded-xl shadow-md transition-transform text-left"
    >
      <Link href={`/plant/${plant.slug}`}>
        <Image
          src={imageUrl}
          alt={plant.scientific_name || "Plant image"}
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
            {plant.scientific_name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-1">
            {plant.commonname_set?.[0]}
          </CardDescription>
        </Link>
        {firstTag && (
          <Link href={`/plant/${plant.slug}`}>
            <Badge className="text-cream-50">{firstTag}</Badge>
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
