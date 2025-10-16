import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
// Note: NextRequest import removed as it's no longer used
import { GardenService } from '@/lib/services'

// Mock the service layer
vi.mock('@/lib/services', () => ({
  GardenService: {
    getUserGardensWithStats: vi.fn(),
    getGardenOverviewStats: vi.fn(),
  },
}))

// Mock Clerk auth
const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
}))

/**
 * Garden Overview API Routes Test Suite
 * 
 * Reason: Integration testing of garden overview API endpoint
 * Ensures API routes properly handle requests and responses
 */
describe('Garden Overview API Routes', () => {
  const mockUserId = 'test-user-123'

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock auth to return authenticated user
    mockAuth.mockResolvedValue({ userId: mockUserId })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('GET /api/gardens/overview', () => {
    it('should return garden overview data successfully', async () => {
      // Arrange
      const mockGardensWithStats = [
        {
          id: 1,
          user_id: mockUserId,
          name: 'Garden 1',
          statistics: {
            totalPlants: 3,
            healthyPlants: 2,
            warningPlants: 1,
            criticalPlants: 0,
            plantsNeedingCare: 1,
          },
        },
        {
          id: 2,
          user_id: mockUserId,
          name: 'Garden 2',
          statistics: {
            totalPlants: 2,
            healthyPlants: 2,
            warningPlants: 0,
            criticalPlants: 0,
            plantsNeedingCare: 0,
          },
        },
      ]

      const mockOverallStats = {
        totalGardens: 2,
        totalPlants: 5,
        healthyPlants: 4,
        warningPlants: 1,
        criticalPlants: 0,
        plantsNeedingCare: 1,
      }

      vi.mocked(GardenService.getUserGardensWithStats).mockResolvedValue(mockGardensWithStats)
      vi.mocked(GardenService.getGardenOverviewStats).mockResolvedValue(mockOverallStats)

      const { GET } = await import('@/app/api/gardens/overview/route')

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({
        gardens: mockGardensWithStats,
        statistics: mockOverallStats,
        plantsNeedingCare: [], // TODO: Implement in service layer
      })
      expect(GardenService.getUserGardensWithStats).toHaveBeenCalledWith(mockUserId)
      expect(GardenService.getGardenOverviewStats).toHaveBeenCalledWith(mockUserId)
    })

    it('should return 401 when user not authenticated', async () => {
      // Arrange
      mockAuth.mockResolvedValue({ userId: null })

      const { GET } = await import('@/app/api/gardens/overview/route')

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 500 when service throws error', async () => {
      // Arrange
      vi.mocked(GardenService.getUserGardensWithStats).mockRejectedValue(new Error('Database error'))

      const { GET } = await import('@/app/api/gardens/overview/route')

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch garden overview' })
    })

    it('should include proper cache headers', async () => {
      // Arrange
      const mockGardensWithStats = []
      const mockOverallStats = {
        totalGardens: 0,
        totalPlants: 0,
        healthyPlants: 0,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 0,
      }

      vi.mocked(GardenService.getUserGardensWithStats).mockResolvedValue(mockGardensWithStats)
      vi.mocked(GardenService.getGardenOverviewStats).mockResolvedValue(mockOverallStats)

      const { GET } = await import('@/app/api/gardens/overview/route')

      // Act
      const response = await GET()

      // Assert
      expect(response.headers.get('Cache-Control')).toBe('private, no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })

    it('should handle empty gardens gracefully', async () => {
      // Arrange
      const mockGardensWithStats = []
      const mockOverallStats = {
        totalGardens: 0,
        totalPlants: 0,
        healthyPlants: 0,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 0,
      }

      vi.mocked(GardenService.getUserGardensWithStats).mockResolvedValue(mockGardensWithStats)
      vi.mocked(GardenService.getGardenOverviewStats).mockResolvedValue(mockOverallStats)

      const { GET } = await import('@/app/api/gardens/overview/route')

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({
        gardens: [],
        statistics: mockOverallStats,
        plantsNeedingCare: [],
      })
    })
  })
})
