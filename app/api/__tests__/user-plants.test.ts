import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { PlantService } from '@/lib/services'

// Mock the service layer
vi.mock('@/lib/services', () => ({
  PlantService: {
    getUserPlants: vi.fn(),
    addPlantToGarden: vi.fn(),
    removePlantFromGarden: vi.fn(),
    updateGardenPlants: vi.fn(),
    getGardenRecommendations: vi.fn(),
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
 * User Plants API Routes Test Suite
 * 
 * Reason: Integration testing of user plants API endpoints
 * Ensures API routes properly handle requests and responses
 */
describe('User Plants API Routes', () => {
  const mockUserId = 'test-user-123'
  const mockGardenId = 1
  const mockPlantId = 'plant-123'

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock auth to return authenticated user
    mockAuth.mockResolvedValue({ userId: mockUserId })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('GET /api/user-plants', () => {
    it('should return user plants successfully', async () => {
      // Arrange
      const mockResponse = {
        gardens: [
          {
            id: mockGardenId,
            user_id: mockUserId,
            name: 'Test Garden',
            user_plants: [],
          },
        ],
        plants: [
          {
            id: 'plant-1',
            gardenId: mockGardenId,
            customName: 'Test Plant',
            botanicalName: 'Unknown',
            status: 'healthy',
            careLogs: [],
            images: [],
            locationTags: [],
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      }

      vi.mocked(PlantService.getUserPlants).mockResolvedValue(mockResponse)

      const { GET } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants')
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(mockResponse)
      expect(PlantService.getUserPlants).toHaveBeenCalledWith(mockUserId, undefined)
    })

    it('should return plants for specific garden when gardenId provided', async () => {
      // Arrange
      const mockResponse = {
        gardens: [
          {
            id: mockGardenId,
            user_id: mockUserId,
            name: 'Test Garden',
            user_plants: [],
          },
        ],
        plants: [],
      }

      vi.mocked(PlantService.getUserPlants).mockResolvedValue(mockResponse)

      const { GET } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants?gardenId=1')
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(mockResponse)
      expect(PlantService.getUserPlants).toHaveBeenCalledWith(mockUserId, mockGardenId)
    })

    it('should return 401 when user not authenticated', async () => {
      // Arrange
      mockAuth.mockResolvedValue({ userId: null })

      const { GET } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants')
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 401 when userId param does not match authenticated user', async () => {
      // Arrange
      const { GET } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants?userId=other-user')
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 404 when garden not found', async () => {
      // Arrange
      vi.mocked(PlantService.getUserPlants).mockRejectedValue(new Error('Garden not found'))

      const { GET } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants?gardenId=999')
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Garden not found' })
    })
  })

  describe('POST /api/user-plants', () => {
    it('should add plant to garden successfully', async () => {
      // Arrange
      const mockResult = {
        plant: {
        id: 'new-plant-id',
        garden_id: mockGardenId,
        plant_id: 123, // Use a valid number instead of parsing the string
        nickname: `Plant ${mockPlantId}`,
        },
      }

      vi.mocked(PlantService.addPlantToGarden).mockResolvedValue(mockResult)

      const { POST } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants', {
        method: 'POST',
        body: JSON.stringify({
          gardenId: mockGardenId,
          plantId: mockPlantId,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Action': 'add-plant',
        },
      })
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(mockResult)
      expect(PlantService.addPlantToGarden).toHaveBeenCalledWith(mockGardenId, mockPlantId, mockUserId)
    })

    it('should remove plant from garden successfully', async () => {
      // Arrange
      const mockResult = { deleted: true }
      vi.mocked(PlantService.removePlantFromGarden).mockResolvedValue(mockResult)

      const { POST } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants', {
        method: 'POST',
        body: JSON.stringify({
          gardenId: mockGardenId,
          plantId: mockPlantId,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Action': 'remove-plant',
        },
      })
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(mockResult)
      expect(PlantService.removePlantFromGarden).toHaveBeenCalledWith(mockGardenId, mockPlantId, mockUserId)
    })

    it('should update garden plants successfully', async () => {
      // Arrange
      const mockResult = {
        plants: [
          {
            id: 'plant-1',
            garden_id: mockGardenId,
            plant_id: 1,
            nickname: 'Plant 1',
          },
          {
            id: 'plant-2',
            garden_id: mockGardenId,
            plant_id: 2,
            nickname: 'Plant 2',
          },
        ],
      }

      vi.mocked(PlantService.updateGardenPlants).mockResolvedValue(mockResult)

      const { POST } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants', {
        method: 'POST',
        body: JSON.stringify({
          gardenId: mockGardenId,
          plantIds: ['1', '2'],
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Action': 'update',
        },
      })
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(mockResult)
      expect(PlantService.updateGardenPlants).toHaveBeenCalledWith(mockGardenId, ['1', '2'], mockUserId)
    })

    it('should return 400 when validation fails for add-plant', async () => {
      // Arrange
      const { POST } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants', {
        method: 'POST',
        body: JSON.stringify({
          gardenId: 'invalid', // Invalid type
          plantId: mockPlantId,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Action': 'add-plant',
        },
      })
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Invalid data')
      expect(data).toHaveProperty('details')
    })

    it('should return 404 when garden not found for add-plant', async () => {
      // Arrange
      vi.mocked(PlantService.addPlantToGarden).mockRejectedValue(new Error('Garden not found'))

      const { POST } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants', {
        method: 'POST',
        body: JSON.stringify({
          gardenId: mockGardenId,
          plantId: mockPlantId,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Action': 'add-plant',
        },
      })
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Garden not found' })
    })

    it('should return 401 when user not authenticated', async () => {
      // Arrange
      mockAuth.mockResolvedValue({ userId: null })

      const { POST } = await import('@/app/api/user-plants/route')

      // Act
      const request = new NextRequest('http://localhost:3000/api/user-plants', {
        method: 'POST',
        body: JSON.stringify({
          gardenId: mockGardenId,
          plantId: mockPlantId,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Action': 'add-plant',
        },
      })
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })
  })
})
