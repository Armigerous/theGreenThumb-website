import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GardenService } from '@/lib/services'

// Mock the service layer
vi.mock('@/lib/services', () => ({
  GardenService: {
    getGardenById: vi.fn(),
    calculateGardenStatistics: vi.fn(),
    updateGarden: vi.fn(),
    deleteGarden: vi.fn(),
    getUserGardensWithStats: vi.fn(),
    getGardenOverviewStats: vi.fn(),
  },
}))

// Mock Clerk auth
const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

/**
 * Garden API Routes Test Suite
 * 
 * Reason: Integration testing of garden API endpoints
 * Ensures API routes properly handle requests and responses
 */
describe('Garden API Routes', () => {
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

  describe('GET /api/gardens/[id]', () => {
    it('should return garden details successfully', async () => {
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
            created_at: new Date('2023-01-01T00:00:00.000Z'),
          },
        ],
      }

      const mockStatistics = {
        totalPlants: 1,
        healthyPlants: 1,
        warningPlants: 0,
        criticalPlants: 0,
        plantsNeedingCare: 1,
      }

      vi.mocked(GardenService.getGardenById).mockResolvedValue(mockGarden)
      vi.mocked(GardenService.calculateGardenStatistics).mockReturnValue(mockStatistics)

      // Import the route handler dynamically
      const { GET } = await import('@/app/api/gardens/[id]/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1')
      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({
        ...mockGarden,
        user_plants: [
          {
            ...mockGarden.user_plants[0],
            created_at: "2023-01-01T00:00:00.000Z", // JSON serializes Date to string
          },
        ],
        statistics: mockStatistics,
      })
      expect(GardenService.getGardenById).toHaveBeenCalledWith(mockGardenId, mockUserId)
      expect(GardenService.calculateGardenStatistics).toHaveBeenCalledWith(mockGarden.user_plants)
    })

    it('should return 401 when user not authenticated', async () => {
      // Arrange
      mockAuth.mockResolvedValue({ userId: null })

      const { GET } = await import('@/app/api/gardens/[id]/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1')
      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 400 when garden ID is invalid', async () => {
      // Arrange
      const { GET } = await import('@/app/api/gardens/[id]/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/invalid')
      const response = await GET(request, { params: Promise.resolve({ id: 'invalid' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Invalid garden ID' })
    })

    it('should return 404 when garden not found', async () => {
      // Arrange
      vi.mocked(GardenService.getGardenById).mockRejectedValue(new Error('Garden not found'))

      const { GET } = await import('@/app/api/gardens/[id]/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1')
      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Garden not found' })
    })

    it('should return 500 when unexpected error occurs', async () => {
      // Arrange
      vi.mocked(GardenService.getGardenById).mockRejectedValue(new Error('Database error'))

      const { GET } = await import('@/app/api/gardens/[id]/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1')
      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch garden details' })
    })
  })

  describe('PUT /api/gardens/[id]', () => {
    it('should update garden successfully', async () => {
      // Arrange
      const mockUpdatedGarden = {
        id: mockGardenId,
        user_id: mockUserId,
        name: 'Updated Garden',
        user_plants: [],
      }

      const updateData = {
        name: 'Updated Garden',
        locationIds: ['location1'],
      }

      vi.mocked(GardenService.updateGarden).mockResolvedValue(mockUpdatedGarden)

      const { PUT } = await import('@/app/api/gardens/[id]/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const response = await PUT(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({ garden: mockUpdatedGarden })
      expect(GardenService.updateGarden).toHaveBeenCalledWith(mockGardenId, mockUserId, updateData)
    })

    it('should return 404 when garden not found', async () => {
      // Arrange
      vi.mocked(GardenService.updateGarden).mockRejectedValue(new Error('Garden not found'))

      const { PUT } = await import('@/app/api/gardens/[id]/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Garden' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const response = await PUT(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Garden not found' })
    })
  })

  describe('DELETE /api/gardens/[id]', () => {
    it('should delete garden successfully', async () => {
      // Arrange
      const mockResult = { success: true }
      vi.mocked(GardenService.deleteGarden).mockResolvedValue(mockResult)

      const { DELETE } = await import('@/app/api/gardens/[id]/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(mockResult)
      expect(GardenService.deleteGarden).toHaveBeenCalledWith(mockGardenId, mockUserId)
    })

    it('should return 404 when garden not found', async () => {
      // Arrange
      vi.mocked(GardenService.deleteGarden).mockRejectedValue(new Error('Garden not found'))

      const { DELETE } = await import('@/app/api/gardens/[id]/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/gardens/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: Promise.resolve({ id: '1' }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Garden not found' })
    })
  })
})
