"use client";

import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@nextui-org/react";
import NextImage from "next/image";

const PlantCard = ({ plant }: { plant: PlantTypeCard }) => {
  const { _id, commonName, scientificName, img } = plant;

  return (
    <Card
      className="m-2"
      isPressable
      onPress={() => console.log({ scientificName })}
    >
      <CardHeader className="pb-0 pt-2 px-4 text-start flex-col items-start justify-end max-h-[20%] h-full">
        <h4 className="font-bold text-large ">{scientificName}</h4>
        <small className="text-default-500 ">{commonName}</small>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          as={NextImage}
          alt={img.alt_text}
          className="object-cover"
          src={img.img}
          width={300}
          height={200}
        />
      </CardBody>

      <CardFooter></CardFooter>
    </Card>
  );
};

export default PlantCard;
