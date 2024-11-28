import Link from "next/link";
import React from "react";
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

const PlantCard = ({ plant }: { plant: PlantSummary }) => {
  return (
    <Link href={`/plant/${plant.slug}`} key={plant.slug} className="group">
      <Card className="overflow-hidden rounded-xl shadow-md transition-transform hover:scale-105 text-left">
        <Image
          src={
            plant.plantimage_set && plant.plantimage_set.length > 0
              ? plant.plantimage_set[0].img
              : "/no-plant-image.png"
          }
          alt={plant.scientific_name || "Plant image"}
          width={300}
          height={200}
          className="w-full object-cover h-48"
        />
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold">
            {plant.scientific_name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {plant.commonname_set?.[0]}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div
            className="text-sm text-muted-foreground line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(plant.description || "", {
                ALLOWED_TAGS: ["p", "strong", "em", "br", "ul", "li"],
              }),
            }}
          />
        </CardContent>
        <CardFooter className="p-4">
          <p className="text-sm text-primary group-hover:underline">
            Learn more
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PlantCard;
