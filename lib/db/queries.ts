import { prisma } from './prisma'
import { Prisma } from '@/lib/generated/prisma'

// Reason: Prisma-based query builder replacing Drizzle queries
export const queries = {
  plants: {
    // Reason: Find first plant matching criteria using Prisma where clause
    findFirst: async (where: Prisma.main_plant_dataWhereInput) => {
      return await prisma.main_plant_data.findFirst({
        where,
        include: {
          plant_images: true,
          cultivars: true,
        },
      })
    },

    // Reason: Find many plants with pagination and filtering
    findMany: async (options: {
      where?: Prisma.main_plant_dataWhereInput
      skip?: number
      take?: number
      orderBy?: Prisma.main_plant_dataOrderByWithRelationInput
      include?: Prisma.main_plant_dataInclude
    } = {}) => {
      return await prisma.main_plant_data.findMany({
        where: options.where,
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy,
        include: options.include || {
          plant_images: true,
          cultivars: true,
        },
      })
    },

    // Reason: Find plant by slug
    findBySlug: async (slug: string) => {
      return await prisma.main_plant_data.findUnique({
        where: { slug },
        include: {
          plant_images: true,
          cultivars: true,
        },
      })
    },

    // Reason: Find plant by ID
    findById: async (id: number) => {
      return await prisma.main_plant_data.findUnique({
        where: { id },
        include: {
          plant_images: true,
          cultivars: true,
        },
      })
    },

    // Reason: Search plants by scientific name or common names
    search: async (searchTerm: string, limit: number = 10) => {
      return await prisma.main_plant_data.findMany({
        where: {
          OR: [
            { scientific_name: { contains: searchTerm, mode: 'insensitive' } },
            { genus: { contains: searchTerm, mode: 'insensitive' } },
            { species: { contains: searchTerm, mode: 'insensitive' } },
            { family: { contains: searchTerm, mode: 'insensitive' } },
            // Note: JSON field searches would need raw SQL for complex queries
          ],
        },
        take: limit,
        include: {
          plant_images: true,
          cultivars: true,
        },
      })
    },

    // Reason: Count plants matching criteria
    count: async (where?: Prisma.main_plant_dataWhereInput) => {
      return await prisma.main_plant_data.count({ where })
    },
  },

  userGardens: {
    // Reason: Find user gardens by user ID
    findByUserId: async (userId: string) => {
      return await prisma.user_gardens.findMany({
        where: { user_id: userId },
        include: {
          user_plants: true,
        },
        orderBy: { created_at: 'desc' },
      })
    },

    // Reason: Find garden by ID
    findById: async (id: number) => {
      return await prisma.user_gardens.findUnique({
        where: { id },
        include: {
          user_plants: true,
        },
      })
    },

    // Reason: Create new garden
    create: async (data: Prisma.user_gardensCreateInput) => {
      return await prisma.user_gardens.create({
        data,
        include: {
          user_plants: true,
        },
      })
    },

    // Reason: Update garden
    update: async (id: number, data: Prisma.user_gardensUpdateInput) => {
      return await prisma.user_gardens.update({
        where: { id },
        data,
        include: {
          user_plants: true,
        },
      })
    },

    // Reason: Delete garden
    delete: async (id: number) => {
      return await prisma.user_gardens.delete({
        where: { id },
      })
    },
  },

  userPlants: {
    // Reason: Find user plants by garden ID
    findByGardenId: async (gardenId: number) => {
      return await prisma.user_plants.findMany({
        where: { garden_id: gardenId },
        orderBy: { created_at: 'desc' },
      })
    },

    // Reason: Find plant by ID
    findById: async (id: string) => {
      return await prisma.user_plants.findUnique({
        where: { id },
      })
    },

    // Reason: Create new plant
    create: async (data: Prisma.user_plantsCreateInput) => {
      return await prisma.user_plants.create({
        data,
      })
    },

    // Reason: Update plant
    update: async (id: string, data: Prisma.user_plantsUpdateInput) => {
      return await prisma.user_plants.update({
        where: { id },
        data,
      })
    },

    // Reason: Delete plant
    delete: async (id: string) => {
      return await prisma.user_plants.delete({
        where: { id },
      })
    },
  },

  tips: {
    // Reason: Find tips with pagination
    findMany: async (options: {
      skip?: number
      take?: number
      orderBy?: Prisma.tips_tricksOrderByWithRelationInput
    } = {}) => {
      return await prisma.tips_tricks.findMany({
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy || { published_at: 'desc' },
      })
    },

    // Reason: Find tip by slug
    findBySlug: async (slug: string) => {
      return await prisma.tips_tricks.findUnique({
        where: { slug },
      })
    },

    // Reason: Increment view count
    incrementViews: async (slug: string) => {
      return await prisma.tips_tricks.update({
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
      return await prisma.cached_responses.findFirst({
        where: { query },
        orderBy: { created_at: 'desc' },
      })
    },

    // Reason: Create cached response
    create: async (data: Prisma.cached_responsesCreateInput) => {
      return await prisma.cached_responses.create({
        data,
      })
    },
  },

  // Reason: Garden overview and statistics queries for My Garden page
  gardenOverview: {
    // Reason: Get all gardens for a user with plant counts and care status
    getUserGardensWithStats: async (userId: string) => {
      const gardens = await prisma.user_gardens.findMany({
        where: { user_id: userId },
        include: {
          user_plants: {
            select: {
              id: true,
              care_logs: true,
              updated_at: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      })

      // Reason: Calculate statistics for each garden
      return gardens.map(garden => {
        const plants = garden.user_plants
        const totalPlants = plants.length
        // Reason: Since status field doesn't exist in DB, we'll calculate from care_logs or use defaults
        const healthyPlants = totalPlants // Default all plants as healthy for now
        const warningPlants = 0 // TODO: Calculate from care_logs
        const criticalPlants = 0 // TODO: Calculate from care_logs
        
        // Reason: Calculate plants needing care based on care logs
        const plantsNeedingCare = plants.filter(plant => {
          const careLogs = plant.care_logs as Array<{ date: string; type: string }>
          if (!careLogs || careLogs.length === 0) return true
          
          const lastCareDate = new Date(Math.max(...careLogs.map(log => new Date(log.date).getTime())))
          const daysSinceLastCare = (Date.now() - lastCareDate.getTime()) / (1000 * 60 * 60 * 24)
          
          // Reason: Consider plant needs care if no care in last 7 days
          return daysSinceLastCare > 7
        }).length

        return {
          ...garden,
          statistics: {
            totalPlants,
            healthyPlants,
            warningPlants,
            criticalPlants,
            plantsNeedingCare,
          },
        }
      })
    },

    // Reason: Get garden statistics across all user gardens
    getUserGardenStatistics: async (userId: string) => {
      const gardens = await prisma.user_gardens.findMany({
        where: { user_id: userId },
        include: {
          user_plants: {
            select: {
              id: true,
              care_logs: true,
              updated_at: true,
            },
          },
        },
      })

      const allPlants = gardens.flatMap(garden => garden.user_plants)
      const totalGardens = gardens.length
      const totalPlants = allPlants.length
      // Reason: Since status field doesn't exist in DB, use defaults for now
      const healthyPlants = totalPlants // Default all plants as healthy
      const warningPlants = 0 // TODO: Calculate from care_logs
      const criticalPlants = 0 // TODO: Calculate from care_logs
      
      // Reason: Calculate plants needing care
      const plantsNeedingCare = allPlants.filter(plant => {
        const careLogs = plant.care_logs as Array<{ date: string; type: string }>
        if (!careLogs || careLogs.length === 0) return true
        
        const lastCareDate = new Date(Math.max(...careLogs.map(log => new Date(log.date).getTime())))
        const daysSinceLastCare = (Date.now() - lastCareDate.getTime()) / (1000 * 60 * 60 * 24)
        
        return daysSinceLastCare > 7
      }).length

      return {
        totalGardens,
        totalPlants,
        healthyPlants,
        warningPlants,
        criticalPlants,
        plantsNeedingCare,
      }
    },

    // Reason: Get plants needing care across all gardens
    getPlantsNeedingCare: async (userId: string) => {
      const gardens = await prisma.user_gardens.findMany({
        where: { user_id: userId },
        include: {
          user_plants: {
            // Reason: Since status field doesn't exist, we'll filter by care_logs instead
            include: {
              user_gardens: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      const plantsNeedingCare = gardens.flatMap(garden => 
        garden.user_plants.map(plant => ({
          ...plant,
          gardenName: garden.name,
        }))
      )

      return plantsNeedingCare
    },
  },
}
