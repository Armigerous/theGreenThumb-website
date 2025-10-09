import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { UserGardenService } from '../user-garden.service'
import { prisma } from '@/lib/db/prisma'

// Mock Prisma
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    user_gardens: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock console.log to avoid test output noise
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

/**
 * User Garden Service Test Suite
 * 
 * Reason: Comprehensive testing of user garden settings business logic
 * Ensures all user garden operations work correctly with proper error handling
 */
describe('UserGardenService', () => {
  const mockUserId = 'test-user-123'

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy.mockClear()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getUserGardenSettings', () => {
    it('should return user garden settings when found', async () => {
      // Arrange
      const mockSettings = {
        id: 1,
        user_id: mockUserId,
        name: 'My Garden',
        landscape_location_ids: ['location1'],
        soil_ph_ids: ['ph1'],
        user_plants: [
          {
            id: 'plant-1',
            garden_id: 1,
            nickname: 'Test Plant',
          },
        ],
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockSettings)

      // Act
      const result = await UserGardenService.getUserGardenSettings(mockUserId)

      // Assert
      expect(result).toEqual(mockSettings)
      expect(prisma.user_gardens.findFirst).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
        include: {
          user_plants: true,
        },
      })
    })

    it('should return null when no settings found', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)

      // Act
      const result = await UserGardenService.getUserGardenSettings(mockUserId)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('saveUserGardenSettings', () => {
    it('should update existing settings successfully', async () => {
      // Arrange
      const mockExistingSettings = {
        id: 1,
        user_id: mockUserId,
        name: 'Old Garden Name',
      }

      const mockUpdatedSettings = {
        id: 1,
        user_id: mockUserId,
        name: 'New Garden Name',
        landscape_location_ids: ['location1'],
        soil_ph_ids: ['ph1'],
      }

      const settingsData = {
        name: 'New Garden Name',
        locationIds: ['location1'],
        soilPhIds: ['ph1'],
        soilTextureIds: [1], // Use number instead of string for BigInt conversion
        sunlightIds: [1], // Use number instead of string for BigInt conversion
        maintenanceLevelId: 2,
        wantsRecommendations: true,
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(mockExistingSettings)
      vi.mocked(prisma.user_gardens.update).mockResolvedValue(mockUpdatedSettings)

      // Act
      const result = await UserGardenService.saveUserGardenSettings(mockUserId, settingsData)

      // Assert
      expect(result).toEqual({ success: true })
      expect(prisma.user_gardens.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          user_id: mockUserId,
          name: 'New Garden Name',
          landscape_location_ids: ['location1'],
          soil_ph_ids: ['ph1'],
          soil_texture_id: BigInt(1), // First element of array
          light_id: BigInt(1), // First element of array
          maintenance_id: BigInt(2),
          wants_recommendations: true,
        }),
      })
      expect(consoleSpy).toHaveBeenCalledWith('Updated user gardens for user:', mockUserId)
    })

    it('should create new settings when none exist', async () => {
      // Arrange
      const mockNewSettings = {
        id: 1,
        user_id: mockUserId,
        name: 'Default Garden',
        landscape_location_ids: [],
        soil_ph_ids: [],
      }

      const settingsData = {
        name: 'My New Garden',
        locationIds: ['location1'],
        soilPhIds: ['ph1'],
      }

      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.user_gardens.create).mockResolvedValue(mockNewSettings)

      // Act
      const result = await UserGardenService.saveUserGardenSettings(mockUserId, settingsData)

      // Assert
      expect(result).toEqual({ success: true })
      expect(prisma.user_gardens.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          user_id: mockUserId,
          name: 'My New Garden',
          landscape_location_ids: ['location1'],
          soil_ph_ids: ['ph1'],
          soil_texture_id: BigInt(1), // Default value
          light_id: BigInt(1), // Default value
          available_space_to_plant_id: BigInt(1), // Default value
          maintenance_id: BigInt(1), // Default value
          wants_recommendations: true, // Default value
        }),
      })
      expect(consoleSpy).toHaveBeenCalledWith('Created new user gardens for user:', mockUserId)
    })

    it('should use default values when data is not provided', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.user_gardens.create).mockResolvedValue({})

      // Act
      const result = await UserGardenService.saveUserGardenSettings(mockUserId, {})

      // Assert
      expect(result).toEqual({ success: true })
      expect(prisma.user_gardens.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          user_id: mockUserId,
          name: 'Default Garden',
          landscape_location_ids: [],
          soil_ph_ids: [],
          soil_texture_id: BigInt(1),
          light_id: BigInt(1),
          available_space_to_plant_id: BigInt(1),
          maintenance_id: BigInt(1),
          wants_recommendations: true,
        }),
      })
    })

    it('should handle BigInt conversion for texture preference', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.user_gardens.create).mockResolvedValue({})

      const settingsData = {
        texturePreferenceId: 5,
      }

      // Act
      await UserGardenService.saveUserGardenSettings(mockUserId, settingsData)

      // Assert
      expect(prisma.user_gardens.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          texture_id: BigInt(5),
        }),
      })
    })

    it('should handle null texture preference', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.user_gardens.create).mockResolvedValue({})

      const settingsData = {
        texturePreferenceId: undefined,
      }

      // Act
      await UserGardenService.saveUserGardenSettings(mockUserId, settingsData)

      // Assert
      expect(prisma.user_gardens.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          texture_id: null,
        }),
      })
    })

    it('should handle growth rate ID as array', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.user_gardens.create).mockResolvedValue({})

      const settingsData = {
        growthRateId: 'rate1',
      }

      // Act
      await UserGardenService.saveUserGardenSettings(mockUserId, settingsData)

      // Assert
      expect(prisma.user_gardens.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          growth_rate_ids: ['rate1'],
        }),
      })
    })

    it('should handle empty growth rate ID', async () => {
      // Arrange
      vi.mocked(prisma.user_gardens.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.user_gardens.create).mockResolvedValue({})

      const settingsData = {
        growthRateId: undefined,
      }

      // Act
      await UserGardenService.saveUserGardenSettings(mockUserId, settingsData)

      // Assert
      expect(prisma.user_gardens.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          growth_rate_ids: [],
        }),
      })
    })
  })
})
