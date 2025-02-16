"use client";

import { dynamicBlurDataUrl } from "@/lib/dynamicBlurDataUrl";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState, useMemo } from "react";
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

const PlantCard = memo(({ plant }: { plant: PlantCardData }) => {
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);

  const imageUrl = useMemo(
    () => (plant.first_image ? plant.first_image : "/no-plant-image.png"),
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
        : "first_common_name" in plant
          ? plant.scientific_name
          : null,
    [plant]
  );

  const subName = useMemo(
    () =>
      "common_name" in plant
        ? plant.scientific_name
        : "first_common_name" in plant
          ? plant.first_common_name
          : null,
    [plant]
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

  return (
    <Card
      key={`${plant.slug}-${plant.scientific_name}`}
      className="group/card overflow-hidden rounded-xl shadow-md transition-transform text-left"
    >
      <Link href={`/plant/${plant.slug}`}>
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={plant.first_image_alt_text || `${plant.scientific_name} Image`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            loading="lazy"
            placeholder="blur"
            blurDataURL={
              blurDataUrl ||
              "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiSk46NjVBQVRAQkBAQEBAQED/2wBDAR4eHh0aHTQaGjRAOC40QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQED/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            } // Fallback blur data URL
          />
        </div>
      </Link>

      <CardHeader>
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
      <CardContent>
        <div
          className="text-sm text-muted-foreground md:line-clamp-3 line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: sanitizedDescription,
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
});

PlantCard.displayName = "PlantCard";

export default PlantCard;
