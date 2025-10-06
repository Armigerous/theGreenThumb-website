import { prisma } from './prisma'
import { Prisma } from '@/lib/generated/prisma'

// Reason: Prisma-based query builder replacing Drizzle queries
export const queries = {
  plants: {
    // Reason: Find first plant matching criteria using Prisma where clause
    findFirst: async (where: Prisma.MainPlantDataWhereInput) => {
      return await prisma.mainPlantData.findFirst({
        where,
        include: {
          plantImages: true,
          cultivars: true,
        },
      })
    },

    // Reason: Find many plants with pagination and filtering
    findMany: async (options: {
      where?: Prisma.MainPlantDataWhereInput
      skip?: number
      take?: number
      orderBy?: Prisma.MainPlantDataOrderByWithRelationInput
      include?: Prisma.MainPlantDataInclude
    } = {}) => {
      return await prisma.mainPlantData.findMany({
        where: options.where,
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy,
        include: options.include || {
          plantImages: true,
          cultivars: true,
        },
      })
    },

    // Reason: Find plant by slug
    findBySlug: async (slug: string) => {
      return await prisma.mainPlantData.findUnique({
        where: { slug },
        include: {
          plantImages: true,
          cultivars: true,
        },
      })
    },

    // Reason: Find plant by ID
    findById: async (id: number) => {
      return await prisma.mainPlantData.findUnique({
        where: { id },
        include: {
          plantImages: true,
          cultivars: true,
        },
      })
    },

    // Reason: Search plants by scientific name or common names
    search: async (searchTerm: string, limit: number = 10) => {
      return await prisma.mainPlantData.findMany({
        where: {
          OR: [
            { scientificName: { contains: searchTerm, mode: 'insensitive' } },
            { genus: { contains: searchTerm, mode: 'insensitive' } },
            { species: { contains: searchTerm, mode: 'insensitive' } },
            { family: { contains: searchTerm, mode: 'insensitive' } },
            // Note: JSON field searches would need raw SQL for complex queries
          ],
        },
        take: limit,
        include: {
          plantImages: true,
          cultivars: true,
        },
      })
    },

    // Reason: Count plants matching criteria
    count: async (where?: Prisma.MainPlantDataWhereInput) => {
      return await prisma.mainPlantData.count({ where })
    },
  },

  userGardens: {
    // Reason: Find user gardens by user ID
    findByUserId: async (userId: string) => {
      return await prisma.userGardens.findMany({
        where: { userId },
        include: {
          userPlants: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    },

    // Reason: Find garden by ID
    findById: async (id: number) => {
      return await prisma.userGardens.findUnique({
        where: { id },
        include: {
          userPlants: true,
        },
      })
    },

    // Reason: Create new garden
    create: async (data: Prisma.UserGardensCreateInput) => {
      return await prisma.userGardens.create({
        data,
        include: {
          userPlants: true,
        },
      })
    },

    // Reason: Update garden
    update: async (id: number, data: Prisma.UserGardensUpdateInput) => {
      return await prisma.userGardens.update({
        where: { id },
        data,
        include: {
          userPlants: true,
        },
      })
    },

    // Reason: Delete garden
    delete: async (id: number) => {
      return await prisma.userGardens.delete({
        where: { id },
      })
    },
  },

  userPlants: {
    // Reason: Find user plants by garden ID
    findByGardenId: async (gardenId: number) => {
      return await prisma.userPlants.findMany({
        where: { gardenId },
        orderBy: { createdAt: 'desc' },
      })
    },

    // Reason: Find plant by ID
    findById: async (id: string) => {
      return await prisma.userPlants.findUnique({
        where: { id },
      })
    },

    // Reason: Create new plant
    create: async (data: Prisma.UserPlantsCreateInput) => {
      return await prisma.userPlants.create({
        data,
      })
    },

    // Reason: Update plant
    update: async (id: string, data: Prisma.UserPlantsUpdateInput) => {
      return await prisma.userPlants.update({
        where: { id },
        data,
      })
    },

    // Reason: Delete plant
    delete: async (id: string) => {
      return await prisma.userPlants.delete({
        where: { id },
      })
    },
  },

  tips: {
    // Reason: Find tips with pagination
    findMany: async (options: {
      skip?: number
      take?: number
      orderBy?: Prisma.TipsTricksOrderByWithRelationInput
    } = {}) => {
      return await prisma.tipsTricks.findMany({
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy || { publishedAt: 'desc' },
      })
    },

    // Reason: Find tip by slug
    findBySlug: async (slug: string) => {
      return await prisma.tipsTricks.findUnique({
        where: { slug },
      })
    },

    // Reason: Increment view count
    incrementViews: async (slug: string) => {
      return await prisma.tipsTricks.update({
        where: { slug },
        data: {
          views: { increment: 1 },
        },
      })
    },
  },

  embeddings: {
    // Reason: Find embedding by ID using raw SQL
    findById: async (id: string) => {
      const result = await prisma.$queryRaw`
        SELECT * FROM embeddings WHERE id = ${id} LIMIT 1
      `
      return Array.isArray(result) ? result[0] : result
    },

    // Reason: Create new embedding using raw SQL
    create: async (data: { id: string; resourceId?: string; content: string; embedding: number[] }) => {
      return await prisma.$executeRaw`
        INSERT INTO embeddings (id, resource_id, content, embedding)
        VALUES (${data.id}, ${data.resourceId}, ${data.content}, ${data.embedding}::vector)
        ON CONFLICT (id) DO UPDATE SET
          resource_id = EXCLUDED.resource_id,
          content = EXCLUDED.content,
          embedding = EXCLUDED.embedding
      `
    },

    // Reason: Update embedding using raw SQL
    update: async (id: string, data: { resourceId?: string; content?: string; embedding?: number[] }) => {
      return await prisma.$executeRaw`
        UPDATE embeddings 
        SET 
          resource_id = COALESCE(${data.resourceId}, resource_id),
          content = COALESCE(${data.content}, content),
          embedding = COALESCE(${data.embedding}::vector, embedding)
        WHERE id = ${id}
      `
    },
  },

  cachedResponses: {
    // Reason: Find cached response by query
    findByQuery: async (query: string) => {
      return await prisma.cachedResponses.findFirst({
        where: { query },
        orderBy: { createdAt: 'desc' },
      })
    },

    // Reason: Create cached response
    create: async (data: Prisma.CachedResponsesCreateInput) => {
      return await prisma.cachedResponses.create({
        data,
      })
    },
  },
}
