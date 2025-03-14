"use client";

import { PlantCardData } from "@/types/plant";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { dynamicBlurDataUrl } from "@/lib/dynamicBlurDataUrl";

const PlantCard = memo(
  ({ plant, index }: { plant: PlantCardData; index: number }) => {
    const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(
      undefined
    );

    const imageUrl = useMemo(
      () => plant.first_image || "/no-plant-image.png",
      [plant.first_image]
    );

    useEffect(() => {
      const fetchBlurDataUrl = async () => {
        if (imageUrl) {
          const blurUrl = await dynamicBlurDataUrl(imageUrl);
          setBlurDataUrl(blurUrl);
        }
      };
      fetchBlurDataUrl();
    }, [imageUrl]);

    const sanitizedDescription = useMemo(
      () =>
        DOMPurify.sanitize(plant.description || "", {
          ALLOWED_TAGS: ["p", "strong", "em", "br", "ul", "li"],
        }),
      [plant.description]
    );

    const displayName = useMemo(
      () =>
        "common_name" in plant
          ? plant.common_name
          : "scientific_name" in plant
            ? plant.scientific_name
            : null,
      [plant]
    );

    const subName = useMemo(
      () =>
        "common_name" in plant
          ? plant.scientific_name
          : "scientific_name" in plant
            ? plant.common_name
            : null,
      [plant]
    );

    return (
      <Card
        key={`${plant.slug}-${plant.scientific_name}`}
        className="group/card overflow-hidden rounded-xl shadow-md transition-transform text-left h-[430px] mx-auto max-w-sm flex flex-col"
      >
        <Link href={`/plant/${plant.slug}`}>
          <div className="relative w-full h-48">
            <Image
              alt={`Photo of ${plant.scientific_name}`}
              className="object-cover"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              src={imageUrl}
              priority={index < 4}
              loading={index < 4 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL={
                blurDataUrl || "data:image/jpeg;base64,/9j/4AAQSkZJRg=="
              } // Fallback blur
            />
          </div>
        </Link>

        <CardHeader className="px-5 py-4">
          <Link href={`/plant/${plant.slug}`} className="group/header">
            <CardTitle className="text-lg font-semibold line-clamp-1 group-hover/header:underline">
              {displayName}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-1">
              {subName}
            </CardDescription>
          </Link>
          {plant.first_tag && (
            <Link href={`/plant/${plant.slug}`}>
              <Badge className="text-cream-50">{plant.first_tag}</Badge>
            </Link>
          )}
        </CardHeader>
        <CardContent className="flex-grow px-5 py-0">
          <div
            className="text-sm text-muted-foreground md:line-clamp-3 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: sanitizedDescription,
            }}
          />
        </CardContent>
        <Link href={`/plant/${plant.slug}`}>
          <CardFooter className="mt-auto px-5 py-4">
            <p className="text-sm text-primary group-hover/card:underline">
              Learn more
            </p>
          </CardFooter>
        </Link>
      </Card>
    );
  }
);

PlantCard.displayName = "PlantCard";

export default PlantCard;
