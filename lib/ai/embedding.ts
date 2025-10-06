import { embed, embedMany } from "ai"
import { openai } from "@ai-sdk/openai"
import { prisma } from "@/lib/db/prisma"

const embeddingModel = openai.embedding("text-embedding-ada-002")

interface PlantData {
  scientific_name?: string
  common_names?: string[]
  description?: string
  genus?: string
  species?: string
  family?: string
  height_min?: number
  height_max?: number
  width_min?: number
  width_max?: number
  [key: string]: unknown
}

const generateChunks = (plant: PlantData): string[] => {
  const chunks = []
  if (plant.scientific_name)
    chunks.push(`Scientific name: ${plant.scientific_name}`)
  if (plant.common_names?.length)
    chunks.push(`Common names: ${plant.common_names.join(", ")}`)
  if (plant.description) chunks.push(`Description: ${plant.description}`)
  if (plant.genus) chunks.push(`Genus: ${plant.genus}`)
  if (plant.species) chunks.push(`Species: ${plant.species}`)
  if (plant.family) chunks.push(`Family: ${plant.family}`)
  if (plant.height_min || plant.height_max) {
    chunks.push(
      `Height: ${plant.height_min || "?"} - ${plant.height_max || "?"} cm`
    )
  }
  if (plant.width_min || plant.width_max) {
    chunks.push(
      `Width: ${plant.width_min || "?"} - ${plant.width_max || "?"} cm`
    )
  }
  return chunks.filter((chunk) => chunk.trim() !== "")
}

export const generateEmbeddings = async (
  plant: PlantData
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(plant)
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  })
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }))
}

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ")
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  })
  return embedding
}

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery)
  
  // Reason: Use raw SQL for vector similarity search since Prisma doesn't support vector operations natively
  const similarPlants = await prisma.$queryRaw<Array<{ content: string; similarity: number }>>`
    SELECT 
      content,
      1 - (embedding <=> ${JSON.stringify(userQueryEmbedded)}::vector) as similarity
    FROM embeddings
    WHERE 1 - (embedding <=> ${JSON.stringify(userQueryEmbedded)}::vector) > 0.3
    ORDER BY similarity DESC
    LIMIT 4
  `
  
  return similarPlants
}

// Reason: Store embedding in database using raw SQL (vector type not supported by Prisma)
export const storeEmbedding = async (
  id: string,
  resourceId: string | null,
  content: string,
  embedding: number[]
) => {
  return await prisma.$executeRaw`
    INSERT INTO embeddings (id, resource_id, content, embedding)
    VALUES (${id}, ${resourceId}, ${content}, ${embedding}::vector)
    ON CONFLICT (id) DO UPDATE SET
      resource_id = EXCLUDED.resource_id,
      content = EXCLUDED.content,
      embedding = EXCLUDED.embedding
  `
}

// Reason: Find embedding by resource ID using raw SQL
export const findEmbeddingByResourceId = async (resourceId: string) => {
  const result = await prisma.$queryRaw`
    SELECT * FROM embeddings WHERE resource_id = ${resourceId} LIMIT 1
  `
  return Array.isArray(result) ? result[0] : result
}

// Reason: Delete embedding by ID using raw SQL
export const deleteEmbedding = async (id: string) => {
  return await prisma.$executeRaw`
    DELETE FROM embeddings WHERE id = ${id}
  `
}
