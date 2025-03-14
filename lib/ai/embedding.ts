import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { deepseek } from "@/lib/ai/deepseek";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "@/lib/db/schema/embeddings";
import { db } from "@/lib/db";

const embeddingModel = openai.embedding("text-embedding-ada-002");

const generateChunks = (plant: any): string[] => {
  const chunks = [];
  if (plant.scientific_name)
    chunks.push(`Scientific name: ${plant.scientific_name}`);
  if (plant.common_names?.length)
    chunks.push(`Common names: ${plant.common_names.join(", ")}`);
  if (plant.description) chunks.push(`Description: ${plant.description}`);
  if (plant.genus) chunks.push(`Genus: ${plant.genus}`);
  if (plant.species) chunks.push(`Species: ${plant.species}`);
  if (plant.family) chunks.push(`Family: ${plant.family}`);
  if (plant.height_min || plant.height_max) {
    chunks.push(
      `Height: ${plant.height_min || "?"} - ${plant.height_max || "?"} cm`
    );
  }
  if (plant.width_min || plant.width_max) {
    chunks.push(
      `Width: ${plant.width_min || "?"} - ${plant.width_max || "?"} cm`
    );
  }
  return chunks.filter((chunk) => chunk.trim() !== "");
};

export const generateEmbeddings = async (
  plant: any
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(plant);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded
  )})`;
  const similarPlants = await db
    .select({ content: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.3))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarPlants;
};
