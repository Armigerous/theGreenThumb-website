import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { PlantService } from '@/lib/services'

// Mock the service layer
vi.mock('@/lib/services', () => ({
  PlantService: {
    getGardenRecommendations: vi.fn(),
  },
}))

// Mock Clerk auth
const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
}))

/**
 * Garden Recommendations API Routes Test Suite
 * 
 * Reason: Integration testing of garden recommendations API endpoint
 * Ensures API routes properly handle requests and responses
 */
describe('Garden Recommendations API Routes', () => {
  const mockUserId = 'test-user-123'
  const mockGardenId = 1

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock auth to return authenticated user
    mockAuth.mockResolvedValue({ userId: mockUserId })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('GET /api/gardens/[id]/recommendations', () => {
    it('should return garden recommendations successfully', async () => {
      // Arrange
      const mockRecommendations = {
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
      }

      vi.mocked(PlantService.getGardenRecommendations).mockResolvedValue(mockRecommendations)

      const { GET } = await import('@/app/api/gardens/[id]/recommendations/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1/recommendations')
      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(mockRecommendations)
      expect(PlantService.getGardenRecommendations).toHaveBeenCalledWith(mockGardenId, mockUserId)
    })

    it('should return 401 when user not authenticated', async () => {
      // Arrange
      mockAuth.mockResolvedValue({ userId: null })

      const { GET } = await import('@/app/api/gardens/[id]/recommendations/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1/recommendations')
      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 400 when garden ID is invalid', async () => {
      // Arrange
      const { GET } = await import('@/app/api/gardens/[id]/recommendations/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/invalid/recommendations')
      const response = await GET(request, { params: Promise.resolve({ id: 'invalid' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Invalid garden ID' })
    })

    it('should return 404 when garden not found', async () => {
      // Arrange
      vi.mocked(PlantService.getGardenRecommendations).mockRejectedValue(new Error('Garden not found'))

      const { GET } = await import('@/app/api/gardens/[id]/recommendations/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1/recommendations')
      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Garden not found' })
    })

    it('should return 500 when unexpected error occurs', async () => {
      // Arrange
      vi.mocked(PlantService.getGardenRecommendations).mockRejectedValue(new Error('Database error'))

      const { GET } = await import('@/app/api/gardens/[id]/recommendations/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1/recommendations')
      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch garden recommendations' })
    })

    it('should include proper cache headers', async () => {
      // Arrange
      const mockRecommendations = {
        recommendations: [],
        gardenName: 'Test Garden',
      }

      vi.mocked(PlantService.getGardenRecommendations).mockResolvedValue(mockRecommendations)

      const { GET } = await import('@/app/api/gardens/[id]/recommendations/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1/recommendations')
      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })

      // Assert
      expect(response.headers.get('Cache-Control')).toBe('private, no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })
  })
})
