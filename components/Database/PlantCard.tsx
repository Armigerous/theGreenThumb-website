"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "@/components/ui/badge";
import { PlantCardData } from "@/types/plant";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { OptimizedImage } from "@/components/ui/smart-image";

const PlantCard = memo(
  ({ plant, index }: { plant: PlantCardData; index: number }) => {
    const imageUrl = useMemo(
      () => plant.first_image || "/no-plant-image.png",
      [plant.first_image]
    );

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
          : "common_name" in plant
            ? plant.scientific_name
            : null,
      [plant]
    );

    const subName = useMemo(
      () =>
        "common_name" in plant
          ? plant.scientific_name
          : "common_name" in plant
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
            <OptimizedImage
              src={imageUrl}
              alt={`Photo of ${plant.scientific_name}`}
              context="card"
              isCritical={index < 4}
              className="object-cover"
              fill
              priority={index < 4}
              loading={index < 4 ? "eager" : "lazy"}
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
