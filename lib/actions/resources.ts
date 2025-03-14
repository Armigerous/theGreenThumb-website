"use server";

import {
  NewPlantParams,
  insertPlantSchema,
  plants,
} from "@/lib/db/schema/resources";
import { generateEmbeddings } from "../ai/embedding";
import { db } from "../db";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";
import { v4 as uuidv4 } from 'uuid';

export const createPlant = async (input: NewPlantParams) => {
  try {
    const plantData = insertPlantSchema.parse(input);

    const [plant] = await db
      .insert(plants)
      .values({ id: 1, ...plantData })
      .returning();

    const typedPlant = {
      scientific_name: plant.scientific_name,
      common_names: Array.isArray(plant.common_names) ? plant.common_names : [],
      description: plant.description || undefined,
      genus: plant.genus || undefined,
      species: plant.species || undefined,
      family: plant.family || undefined,
      height_min: plant.height_min || undefined,
      height_max: plant.height_max || undefined,
      width_min: plant.width_min || undefined,
      width_max: plant.width_max || undefined,
    };

    const embeddings = await generateEmbeddings(typedPlant);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        id: uuidv4(),
        content: embedding.content,
        embedding: embedding.embedding,
        resourceId: plant.id.toString(),
      }))
    );
    return "Plant successfully created and embedded.";
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};
