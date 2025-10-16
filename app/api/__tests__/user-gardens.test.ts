import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
// Note: NextRequest import removed as it's no longer used
import { UserGardenService } from '@/lib/services'

// Mock the service layer
vi.mock('@/lib/services', () => ({
  UserGardenService: {
    getUserGardenSettings: vi.fn(),
    saveUserGardenSettings: vi.fn(),
  },
}))

// Mock Clerk auth
const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
}))

/**
 * User Gardens API Routes Test Suite
 * 
 * Reason: Integration testing of user garden settings API endpoints
 * Ensures API routes properly handle requests and responses
 */
describe('User Gardens API Routes', () => {
  const mockUserId = 'test-user-123'

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock auth to return authenticated user
    mockAuth.mockResolvedValue({ userId: mockUserId })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('GET /api/user-gardens', () => {
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

      vi.mocked(UserGardenService.getUserGardenSettings).mockResolvedValue(mockSettings)

      const { GET } = await import('@/app/api/user-gardens/route')

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({ settings: mockSettings })
      expect(UserGardenService.getUserGardenSettings).toHaveBeenCalledWith(mockUserId)
    })

    it('should return null settings when none found', async () => {
      // Arrange
      vi.mocked(UserGardenService.getUserGardenSettings).mockResolvedValue(null)

      const { GET } = await import('@/app/api/user-gardens/route')

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({ settings: null })
      expect(UserGardenService.getUserGardenSettings).toHaveBeenCalledWith(mockUserId)
    })

    it('should return 401 when user not authenticated', async () => {
      // Arrange
      mockAuth.mockResolvedValue({ userId: null })

      const { GET } = await import('@/app/api/user-gardens/route')

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should include proper cache headers', async () => {
      // Arrange
      const mockSettings = {
        id: 1,
        user_id: mockUserId,
        name: 'My Garden',
        user_plants: [],
      }

      vi.mocked(UserGardenService.getUserGardenSettings).mockResolvedValue(mockSettings)

      const { GET } = await import('@/app/api/user-gardens/route')

      // Act
      const response = await GET()

      // Assert
      expect(response.headers.get('Cache-Control')).toBe('private, no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })
  })

  describe('POST /api/user-gardens', () => {
    it('should save user garden settings successfully', async () => {
      // Arrange
      const mockResult = { success: true }
      const settingsData = {
        name: 'My New Garden',
        locationIds: ['location1'],
        soilPhIds: ['ph1'],
        soilTextureIds: ['texture1'],
        sunlightIds: ['light1'],
        maintenanceLevelId: 2,
        wantsRecommendations: true,
      }

      vi.mocked(UserGardenService.saveUserGardenSettings).mockResolvedValue(mockResult)

      const { POST } = await import('@/app/api/user-gardens/route')

      // Act
      // Note: Request object removed as it's not used in the test
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(mockResult)
      expect(UserGardenService.saveUserGardenSettings).toHaveBeenCalledWith(mockUserId, settingsData)
    })

    it('should return 401 when user not authenticated', async () => {
      // Arrange
      mockAuth.mockResolvedValue({ userId: null })

      const { POST } = await import('@/app/api/user-gardens/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-gardens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Garden',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 500 when service throws error', async () => {
      // Arrange
      vi.mocked(UserGardenService.saveUserGardenSettings).mockRejectedValue(new Error('Database error'))

      const { POST } = await import('@/app/api/user-gardens/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-gardens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Garden',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to save user gardens' })
    })

    it('should include proper cache headers', async () => {
      // Arrange
      const mockResult = { success: true }
      vi.mocked(UserGardenService.saveUserGardenSettings).mockResolvedValue(mockResult)

      const { POST } = await import('@/app/api/user-gardens/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-gardens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Garden',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const response = await POST(request)

      // Assert
      expect(response.headers.get('Cache-Control')).toBe('private, no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })
  })
})
