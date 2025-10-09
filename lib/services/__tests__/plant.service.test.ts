import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PlantService } from '../plant.service'
import { prisma } from '@/lib/db/prisma'

// Mock Prisma
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    user_gardens: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    user_plants: {
      findFirst: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    main_plant_data: {
      findMany: vi.fn(),
    },
  },
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

/**
 * Plant Service Test Suite
 * 
 * Reason: Comprehensive testing of plant business logic
 * Ensures all plant operations work correctly with proper error handling
 */
describe('PlantService', () => {
  const mockUserId = 'test-user-123'
  const mockGardenId = 1
  const mockPlantId = 'plant-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getUserPlants', () => {
    it('should return plants from all gardens when no gardenId specified', async () => {
      // Arrange
      const mockGardens = [
        {
          id: 1,
          user_id: mockUserId,
          name: 'Garden 1',
          user_plants: [
            {
              id: 'plant-1',
              garden_id: 1,
              nickname: 'Plant 1',
              care_logs: [{ date: '2023-01-01', type: 'water' }],
              images: [{ url: 'image1.jpg' }],
              created_at: new Date('2023-01-01'),
              updated_at: new Date('2023-01-01'),
            },
          ],
        },
        {
          id: 2,
          user_id: mockUserId,
          name: 'Garden 2',
          user_plants: [
            {
              id: 'plant-2',
              garden_id: 2,
              nickname: 'Plant 2',
              care_logs: [],
              images: [],
              created_at: new Date('2023-01-02'),
              updated_at: new Date('2023-01-02'),
            },
          ],
        },
      ]

      vi.mocked(prisma.user_gardens.findMany).mockResolvedValue(mockGardens)

      // Act
      const result = await PlantService.getUserPlants(mockUserId)

      // Assert
      expect(result.gardens).toEqual(mockGardens)
      expect(result.plants).toHaveLength(2)
      expect(result.plants[0]).toEqual({
        id: 'plant-1',
        gardenId: 1,
        customName: 'Plant 1',
        botanicalName: 'Unknown',
        status: 'healthy',
        careLogs: [{ date: '2023-01-01', type: 'water' }],
        images: [{ url: 'image1.jpg' }],
        locationTags: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      })
    })

    it('should return plants from specific garden when gardenId specified', async () => {
      // Arrange
      const mockGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Test Garden',
        user_plants: [
          {
            id: 'plant-1',
            garden_id: mockGardenId,
            nickname: 'Test Plant',
            care_logs: [],
            images: [],
            created_at: new Date('2023-01-01'),
            updated_at: new Date('2023-01-01'),
          },
        ],
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockGarden)

      // Act
      const result = await PlantService.getUserPlants(mockUserId, mockGardenId)

      // Assert
      expect(result.gardens).toEqual([mockGarden])
      expect(result.plants).toHaveLength(1)
      expect(result.plants[0].gardenId).toBe(mockGardenId)
    })

    it('should throw error when specific garden not found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act & Assert
      await expect(PlantService.getUserPlants(mockUserId, mockGardenId))
        .rejects.toThrow('Garden not found')
    })

    it('should return empty arrays when no gardens found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findMany).mockResolvedValue([])

      // Act
      const result = await PlantService.getUserPlants(mockUserId)

      // Assert
      expect(result).toEqual({ gardens: [], plants: [] })
    })
  })

  describe('addPlantToGarden', () => {
    it('should add plant to garden successfully', async () => {
      // Arrange
      const mockGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Test Garden',
      }

      const mockNewPlant = {
        id: 'new-plant-id',
        garden_id: mockGardenId,
        plant_id: parseInt(mockPlantId),
        nickname: `Plant ${mockPlantId}`,
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockGarden)
      vi.mocked(prisma.user_plants.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.user_plants.create).mockResolvedValue(mockNewPlant)

      // Act
      const result = await PlantService.addPlantToGarden(mockGardenId, mockPlantId, mockUserId)

      // Assert
      expect(result).toEqual({ plant: mockNewPlant })
      expect(prisma.user_plants.create).toHaveBeenCalledWith({
        data: {
          garden_id: mockGardenId,
          plant_id: parseInt(mockPlantId),
          nickname: `Plant ${mockPlantId}`,
        },
      })
    })

    it('should return existing plant when plant already in garden', async () => {
      // Arrange
      const mockGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Test Garden',
      }

      const mockExistingPlant = {
        id: 'existing-plant-id',
        garden_id: mockGardenId,
        plant_id: parseInt(mockPlantId),
        nickname: 'Existing Plant',
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockGarden)
      vi.mocked(prisma.user_plants.findFirst).mockResolvedValue(mockExistingPlant)

      // Act
      const result = await PlantService.addPlantToGarden(mockGardenId, mockPlantId, mockUserId)

      // Assert
      expect(result).toEqual({ 
        message: "Plant already in garden", 
        plant: mockExistingPlant 
      })
      expect(prisma.user_plants.create).not.toHaveBeenCalled()
    })

    it('should throw error when garden not found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act & Assert
      await expect(PlantService.addPlantToGarden(mockGardenId, mockPlantId, mockUserId))
        .rejects.toThrow('Garden not found')
    })
  })

  describe('removePlantFromGarden', () => {
    it('should remove plant from garden successfully', async () => {
      // Arrange
      const mockGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Test Garden',
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockGarden)
      vi.mocked(prisma.user_plants.deleteMany).mockResolvedValue({ count: 1 })

      // Act
      const result = await PlantService.removePlantFromGarden(mockGardenId, mockPlantId, mockUserId)

      // Assert
      expect(result).toEqual({ deleted: true })
      expect(prisma.user_plants.deleteMany).toHaveBeenCalledWith({
        where: {
          garden_id: mockGardenId,
          plant_id: parseInt(mockPlantId),
        },
      })
    })

    it('should return false when plant not found for deletion', async () => {
      // Arrange
      const mockGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Test Garden',
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockGarden)
      vi.mocked(prisma.user_plants.deleteMany).mockResolvedValue({ count: 0 })

      // Act
      const result = await PlantService.removePlantFromGarden(mockGardenId, mockPlantId, mockUserId)

      // Assert
      expect(result).toEqual({ deleted: false })
    })

    it('should throw error when garden not found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act & Assert
      await expect(PlantService.removePlantFromGarden(mockGardenId, mockPlantId, mockUserId))
        .rejects.toThrow('Garden not found')
    })
  })

  describe('updateGardenPlants', () => {
    it('should update all plants in garden successfully', async () => {
      // Arrange
      const mockGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Test Garden',
      }

      const mockNewPlants = [
        {
          id: 'new-plant-1',
          garden_id: mockGardenId,
          plant_id: 1,
          nickname: 'Plant 1',
        },
        {
          id: 'new-plant-2',
          garden_id: mockGardenId,
          plant_id: 2,
          nickname: 'Plant 2',
        },
      ]

      const plantIds = ['1', '2']

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockGarden)
      vi.mocked(prisma.user_plants.deleteMany).mockResolvedValue({ count: 2 })
      vi.mocked(prisma.user_plants.create)
        .mockResolvedValueOnce(mockNewPlants[0])
        .mockResolvedValueOnce(mockNewPlants[1])

      // Act
      const result = await PlantService.updateGardenPlants(mockGardenId, plantIds, mockUserId)

      // Assert
      expect(result).toEqual({ plants: mockNewPlants })
      expect(prisma.user_plants.deleteMany).toHaveBeenCalledWith({
        where: { garden_id: mockGardenId },
      })
      expect(prisma.user_plants.create).toHaveBeenCalledTimes(2)
    })

    it('should throw error when garden not found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act & Assert
      await expect(PlantService.updateGardenPlants(mockGardenId, ['1'], mockUserId))
        .rejects.toThrow('Garden not found')
    })
  })

  describe('getGardenRecommendations', () => {
    it('should return plant recommendations successfully', async () => {
      // Arrange
      const mockGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Test Garden',
        usda_zone_ids: ['zone1', 'zone2'],
        light_id: BigInt(1),
        soil_texture_id: BigInt(2),
        user_plants: [
          { nickname: 'Existing Plant' },
        ],
      }

      const mockRecommendations = [
        {
          id: 1,
          slug: 'test-plant-1',
          scientific_name: 'Testus plantus',
          common_names: ['Test Plant'],
          description: 'A test plant',
          plant_images: [
            { img: 'test-image.jpg', alt_text: 'Test plant image' },
          ],
        },
        {
          id: 2,
          slug: 'test-plant-2',
          scientific_name: 'Testus plantus 2',
          common_names: 'Test Plant 2',
          description: 'Another test plant',
          plant_images: [],
        },
      ]

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockGarden)
      vi.mocked(prisma.main_plant_data.findMany).mockResolvedValue(mockRecommendations)

      // Act
      const result = await PlantService.getGardenRecommendations(mockGardenId, mockUserId)

      // Assert
      expect(result).toEqual({
        recommendations: [
          {
            id: 1,
            slug: 'test-plant-1',
            scientificName: 'Testus plantus',
            commonName: 'Test Plant',
            description: 'A test plant',
            image: 'test-image.jpg',
            imageAlt: 'Test plant image',
          },
          {
            id: 2,
            slug: 'test-plant-2',
            scientificName: 'Testus plantus 2',
            commonName: 'Test Plant 2',
            description: 'Another test plant',
            image: null,
            imageAlt: null,
          },
        ],
        gardenName: 'Test Garden',
      })
    })

    it('should throw error when garden not found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act & Assert
      await expect(PlantService.getGardenRecommendations(mockGardenId, mockUserId))
        .rejects.toThrow('Garden not found')
    })
  })
})
