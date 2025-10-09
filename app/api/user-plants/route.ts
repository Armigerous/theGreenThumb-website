import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PlantService } from "@/lib/services"

// Route Segment Config
export const dynamic = 'force-dynamic' // Always fetch fresh data for user-specific content
export const revalidate = 0 // Disable static caching

// Validation schemas
const AddPlantSchema = z.object({
  gardenId: z.number(),
  plantId: z.string()
})

const RemovePlantSchema = z.object({
  gardenId: z.number(),
  plantId: z.string()
})

const UpdatePlantsSchema = z.object({
  gardenId: z.number(),
  plantIds: z.array(z.string())
})

// Plant interface to properly type our response
interface Plant {
  id: string
  gardenId: number
  customName: string
  botanicalName: string
  status: string
  careLogs: Record<string, unknown>[]
  images: { url: string; altText?: string }[]
  locationTags: string[]
  createdAt: string
  updatedAt: string
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const url = new URL(request.url)
    const userIdParam = url.searchParams.get("userId")
    const gardenIdParam = url.searchParams.get("gardenId")
    
    // Check if the requested userId matches the authenticated user
    if (userIdParam && userIdParam !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Reason: Use service layer to get user plants
    const gardenId = gardenIdParam ? parseInt(gardenIdParam) : undefined
    const userGardensResponse = await PlantService.getUserPlants(userId, gardenId)
    
    return NextResponse.json(userGardensResponse, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error fetching user plants:", error)
    if (error instanceof Error && error.message === 'Garden not found') {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to fetch user plants data" },
      { status: 500 }
    )
  }
}

// Add a plant to a garden
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const data = await request.json()
    const action = request.headers.get("X-Action") || "update" // Default action is "update"
    
    // Handle different actions based on the X-Action header
    switch (action) {
      case "add-plant": {
        // Add single plant to garden
        const validationResult = AddPlantSchema.safeParse(data)
        if (!validationResult.success) {
          return NextResponse.json(
            { error: "Invalid data", details: validationResult.error.format() },
            { status: 400 }
          )
        }
        
        const { gardenId, plantId } = validationResult.data
        
        // Reason: Use service layer to add plant to garden
        const result = await PlantService.addPlantToGarden(gardenId, plantId, userId)
        
        return NextResponse.json(result)
      }
      
      case "remove-plant": {
        // Remove single plant from garden
        const validationResult = RemovePlantSchema.safeParse(data)
        if (!validationResult.success) {
          return NextResponse.json(
            { error: "Invalid data", details: validationResult.error.format() },
            { status: 400 }
          )
        }
        
        const { gardenId, plantId } = validationResult.data
        
        // Reason: Use service layer to remove plant from garden
        const result = await PlantService.removePlantFromGarden(gardenId, plantId, userId)
        
        return NextResponse.json(result)
      }
      
      case "update": 
      default: {
        // Update all plants in garden (replace entire array)
        const validationResult = UpdatePlantsSchema.safeParse(data)
        if (!validationResult.success) {
          return NextResponse.json(
            { error: "Invalid data", details: validationResult.error.format() },
            { status: 400 }
          )
        }
        
        const { gardenId, plantIds } = validationResult.data
        
        // Reason: Use service layer to update garden plants
        const result = await PlantService.updateGardenPlants(gardenId, plantIds, userId)
        
        return NextResponse.json(result)
      }
    }
  } catch (error) {
    console.error("Error updating user plants:", error)
    if (error instanceof Error && error.message === 'Garden not found') {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to update user plants data" },
      { status: 500 }
    )
  }
}
