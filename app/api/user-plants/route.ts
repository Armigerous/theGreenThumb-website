import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

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
    
    // Fetch user gardens
    let gardens = []
    
    if (gardenIdParam) {
      // If gardenId is provided, only fetch that specific garden
      const garden = await prisma.userGardens.findFirst({
        where: {
          userId,
          id: parseInt(gardenIdParam)
        },
        include: {
          userPlants: true
        }
      })
      
      if (!garden) {
        return NextResponse.json({ error: "Garden not found" }, { status: 404 })
      }
      
      gardens = [garden]
    } else {
      // Otherwise fetch all gardens
      gardens = await prisma.userGardens.findMany({
        where: { userId },
        include: {
          userPlants: true
        }
      })
    }
    
    if (!gardens.length) {
      return NextResponse.json({ gardens: [], plants: [] })
    }
    
    // Flatten all plants from all gardens
    const plants: Plant[] = gardens.flatMap(garden => 
      garden.userPlants.map(plant => ({
        id: plant.id,
        gardenId: plant.gardenId,
        customName: plant.customName,
        botanicalName: plant.botanicalName,
        status: plant.status,
        careLogs: plant.careLogs as Record<string, unknown>[],
        images: plant.images as { url: string; altText?: string }[],
        locationTags: plant.locationTags as string[],
        createdAt: plant.createdAt.toISOString(),
        updatedAt: plant.updatedAt.toISOString(),
      }))
    )
    
    // Prepare response
    const userGardensResponse = {
      gardens,
      plants
    }
    
    return NextResponse.json(userGardensResponse, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error fetching user plants:", error)
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
        
        // Verify garden ownership
        const garden = await prisma.userGardens.findFirst({
          where: {
            userId,
            id: gardenId
          }
        })
        
        if (!garden) {
          return NextResponse.json({ error: "Garden not found" }, { status: 404 })
        }
        
        // Add plant to the userPlantsId array if not already there
        const currentPlantIds = (garden.userPlantsId as string[]) || []
        if (!currentPlantIds.includes(plantId)) {
          const updatedPlantIds = [...currentPlantIds, plantId]
          
          const updatedGarden = await prisma.userGardens.update({
            where: { id: gardenId },
            data: {
              userPlantsId: updatedPlantIds,
            }
          })
          
          revalidatePath('/api/user-plants')
          
          return NextResponse.json({ garden: updatedGarden })
        } else {
          return NextResponse.json({ message: "Plant already in garden", garden })
        }
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
        
        // Verify garden ownership
        const garden = await prisma.userGardens.findFirst({
          where: {
            userId,
            id: gardenId
          }
        })
        
        if (!garden) {
          return NextResponse.json({ error: "Garden not found" }, { status: 404 })
        }
        
        // Remove plant from the userPlantsId array
        const currentPlantIds = (garden.userPlantsId as string[]) || []
        const updatedPlantIds = currentPlantIds.filter(id => id !== plantId)
        
        const updatedGarden = await prisma.userGardens.update({
          where: { id: gardenId },
          data: {
            userPlantsId: updatedPlantIds,
          }
        })
        
        revalidatePath('/api/user-plants')
        
        return NextResponse.json({ garden: updatedGarden })
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
        
        // Verify garden ownership
        const garden = await prisma.userGardens.findFirst({
          where: {
            userId,
            id: gardenId
          }
        })
        
        if (!garden) {
          return NextResponse.json({ error: "Garden not found" }, { status: 404 })
        }
        
        // Update garden with new plant IDs
        const updatedGarden = await prisma.userGardens.update({
          where: { id: gardenId },
          data: {
            userPlantsId: plantIds,
          }
        })
        
        revalidatePath('/api/user-plants')
        
        return NextResponse.json({ garden: updatedGarden })
      }
    }
  } catch (error) {
    console.error("Error updating user plants:", error)
    return NextResponse.json(
      { error: "Failed to update user plants data" },
      { status: 500 }
    )
  }
}
