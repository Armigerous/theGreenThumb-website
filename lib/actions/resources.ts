"use server";

import {
  NewPlantParams,
  insertPlantSchema,
  plants,
} from "@/lib/db/schema/resources";
import { generateEmbeddings } from "../ai/embedding";
import { db } from "../db";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";

export const createPlant = async (input: NewPlantParams) => {
  try {
    const plantData = insertPlantSchema.parse(input);

    const [plant] = await db
      .insert(plants)
      .values({ id: 1, ...plantData })
      .returning();

    const embeddings = await generateEmbeddings(plant);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        plantId: plant.id,
        ...embedding,
      }))
    );
    return "Plant successfully created and embedded.";
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};
