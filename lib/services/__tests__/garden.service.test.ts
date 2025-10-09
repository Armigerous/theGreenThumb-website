import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { GardenService } from '../garden.service'
import { prisma } from '@/lib/db/prisma'

// Mock Prisma
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    user_gardens: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user_plants: {
      deleteMany: vi.fn(),
    },
  },
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

/**
 * Garden Service Test Suite
 * 
 * Reason: Comprehensive testing of garden business logic
 * Ensures all garden operations work correctly with proper error handling
 */
describe('GardenService', () => {
  const mockUserId = 'test-user-123'
  const mockGardenId = 1

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getGardenById', () => {
    it('should return garden when found and user owns it', async () => {
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
            created_at: new Date(),
          },
        ],
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockGarden)

      // Act
      const result = await GardenService.getGardenById(mockGardenId, mockUserId)

      // Assert
      expect(result).toEqual(mockGarden)
      expect(prisma.user_gardens.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockGardenId,
          user_id: mockUserId,
        },
        include: {
          user_plants: {
            orderBy: { created_at: 'desc' },
          },
        },
      })
    })

    it('should throw error when garden not found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act & Assert
      await expect(GardenService.getGardenById(mockGardenId, mockUserId))
        .rejects.toThrow('Garden not found')
    })

    it('should throw error when user does not own garden', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act & Assert
      await expect(GardenService.getGardenById(mockGardenId, 'other-user'))
        .rejects.toThrow('Garden not found')
    })
  })

  describe('calculateGardenStatistics', () => {
    it('should calculate statistics correctly for plants with care logs', () => {
      // Arrange
      const mockPlants = [
        {
          care_logs: [
            { date: '2023-01-01', type: 'water' },
            { date: '2023-01-02', type: 'fertilize' },
          ],
        },
        {
          care_logs: [
            { date: '2023-01-01', type: 'water' },
          ],
        },
        {
          care_logs: [],
        },
      ]

      // Act
      const result = GardenService.calculateGardenStatistics(mockPlants)

      // Assert
      expect(result).toEqual({
        totalPlants: 3,
        healthyPlants: 3,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 1, // Plant with no care logs
      })
    })

    it('should handle plants with recent care logs', () => {
      // Arrange
      const recentDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      const mockPlants = [
        {
          care_logs: [
            { date: recentDate.toISOString(), type: 'water' },
          ],
        },
        {
          care_logs: [
            { date: recentDate.toISOString(), type: 'fertilize' },
          ],
        },
      ]

      // Act
      const result = GardenService.calculateGardenStatistics(mockPlants)

      // Assert
      expect(result).toEqual({
        totalPlants: 2,
        healthyPlants: 2,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 0, // Recent care logs
      })
    })

    it('should handle plants with old care logs', () => {
      // Arrange
      const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      const mockPlants = [
        {
          care_logs: [
            { date: oldDate.toISOString(), type: 'water' },
          ],
        },
      ]

      // Act
      const result = GardenService.calculateGardenStatistics(mockPlants)

      // Assert
      expect(result).toEqual({
        totalPlants: 1,
        healthyPlants: 1,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 1, // Old care logs
      })
    })

    it('should handle empty plants array', () => {
      // Act
      const result = GardenService.calculateGardenStatistics([])

      // Assert
      expect(result).toEqual({
        totalPlants: 0,
        healthyPlants: 0,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 0,
      })
    })
  })

  describe('updateGarden', () => {
    it('should update garden successfully', async () => {
      // Arrange
      const mockExistingGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Old Garden Name',
      }

      const mockUpdatedGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'New Garden Name',
        user_plants: [],
      }

      const updateData = {
        name: 'New Garden Name',
        locationIds: ['location1'],
        soilDrainageIds: ['drainage1'],
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockExistingGarden)
      vi.mocked(prisma.user_gardens.update).mockResolvedValue(mockUpdatedGarden)

      // Act
      const result = await GardenService.updateGarden(mockGardenId, mockUserId, updateData)

      // Assert
      expect(result).toEqual(mockUpdatedGarden)
      expect(prisma.user_gardens.update).toHaveBeenCalledWith({
        where: { id: mockGardenId },
        data: expect.objectContaining({
          name: 'New Garden Name',
          landscape_location_ids: ['location1'],
          soil_drainage_ids: ['drainage1'],
        }),
        include: {
          user_plants: true,
        },
      })
    })

    it('should throw error when garden not found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act & Assert
      await expect(GardenService.updateGarden(mockGardenId, mockUserId, {}))
        .rejects.toThrow('Garden not found')
    })
  })

  describe('deleteGarden', () => {
    it('should delete garden and all plants successfully', async () => {
      // Arrange
      const mockExistingGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Test Garden',
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockExistingGarden)
      vi.mocked(prisma.user_plants.deleteMany).mockResolvedValue({ count: 2 })
      vi.mocked(prisma.user_gardens.delete).mockResolvedValue(mockExistingGarden)

      // Act
      const result = await GardenService.deleteGarden(mockGardenId, mockUserId)

      // Assert
      expect(result).toEqual({ success: true })
      expect(prisma.user_plants.deleteMany).toHaveBeenCalledWith({
        where: { garden_id: mockGardenId },
      })
      expect(prisma.user_gardens.delete).toHaveBeenCalledWith({
        where: { id: mockGardenId },
      })
    })

    it('should throw error when garden not found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act & Assert
      await expect(GardenService.deleteGarden(mockGardenId, mockUserId))
        .rejects.toThrow('Garden not found')
    })
  })

  describe('getUserGardensWithStats', () => {
    it('should return gardens with calculated statistics', async () => {
      // Arrange
      const mockGardens = [
        {
          id: 1,
          user_id: mockUserId,
          name: 'Garden 1',
          user_plants: [
            {
              id: 'plant-1',
              care_logs: [{ date: '2023-01-01', type: 'water' }],
              updated_at: new Date(),
            },
            {
              id: 'plant-2',
              care_logs: [],
              updated_at: new Date(),
            },
          ],
        },
        {
          id: 2,
          user_id: mockUserId,
          name: 'Garden 2',
          user_plants: [
            {
              id: 'plant-3',
              care_logs: [{ date: '2023-01-01', type: 'water' }],
              updated_at: new Date(),
            },
          ],
        },
      ]

      vi.mocked(prisma.user_gardens.findMany).mockResolvedValue(mockGardens)

      // Act
      const result = await GardenService.getUserGardensWithStats(mockUserId)

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('statistics')
      expect(result[0].statistics).toEqual({
        totalPlants: 2,
        healthyPlants: 2,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 1,
      })
      expect(result[1].statistics).toEqual({
        totalPlants: 1,
        healthyPlants: 1,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 0,
      })
    })
  })

  describe('getGardenOverviewStats', () => {
    it('should return overall statistics across all gardens', async () => {
      // Arrange
      const mockGardens = [
        {
          id: 1,
          user_plants: [
            { id: 'plant-1', care_logs: [], updated_at: new Date() },
            { id: 'plant-2', care_logs: [{ date: '2023-01-01', type: 'water' }], updated_at: new Date() },
          ],
        },
        {
          id: 2,
          user_plants: [
            { id: 'plant-3', care_logs: [], updated_at: new Date() },
          ],
        },
      ]

      vi.mocked(prisma.user_gardens.findMany).mockResolvedValue(mockGardens)

      // Act
      const result = await GardenService.getGardenOverviewStats(mockUserId)

      // Assert
      expect(result).toEqual({
        totalGardens: 2,
        totalPlants: 3,
        healthyPlants: 3,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 2, // Two plants with no care logs
      })
    })
  })
})
