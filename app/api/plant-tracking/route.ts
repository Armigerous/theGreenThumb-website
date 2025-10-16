import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Route Segment Config
export const dynamic = 'force-dynamic' // Always fetch fresh data for user-specific content
export const revalidate = 0 // Disable static caching

// Validation schema for plant tracking
const userPlantsSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for updates
  gardenId: z.number(),
  customName: z.string().min(1, "Custom name is required"),
  plantId: z.number().min(1, "Plant ID is required"), // Integer ID from main_plant_data table
  status: z.enum(["healthy", "warning", "critical", "dormant"]),
  careLogs: z.array(z.object({
    date: z.string(),
    type: z.enum(["water", "fertilize", "prune", "treatment"]),
    notes: z.string(),
    images: z.array(z.string()).optional()
  })).optional().default([]),
  images: z.array(z.object({
    url: z.string(),
    isPrimary: z.boolean(),
    uploadedAt: z.string()
  })).optional().default([]),
  locationTags: z.array(z.string()).optional().default([])
})

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const url = new URL(request.url)
    const gardenId = url.searchParams.get("gardenId")
    const limit = parseInt(url.searchParams.get("limit") || "50")
    const offset = parseInt(url.searchParams.get("offset") || "0")
    
    // Verify the garden belongs to the user
    const garden = await prisma.user_gardens.findFirst({
      where: {
        user_id: userId,
        ...(gardenId ? { id: parseInt(gardenId) } : {})
      }
    })
    
    if (gardenId && !garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    
    // Fetch plants for this garden
    let plants = []
    if (gardenId) {
      // If gardenId is provided, find all plants for that garden
      plants = await prisma.user_plants.findMany({
        where: { garden_id: parseInt(gardenId) },
        take: limit,
        skip: offset,
        orderBy: { created_at: 'desc' }
      })
    } else {
      // Otherwise find all plants from all gardens owned by the user
      const userGardensData = await prisma.user_gardens.findMany({
        where: { user_id: userId },
        include: {
          user_plants: {
            take: limit,
            skip: offset,
            orderBy: { created_at: 'desc' }
          }
        }
      })
      
      // Flatten the plants from all gardens
      plants = userGardensData.flatMap(garden => garden.user_plants || [])
    }
    
    return NextResponse.json({ plants }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error fetching plant tracking:", error)
    return NextResponse.json(
      { error: "Failed to fetch plant tracking data" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const data = await request.json()
    
    // Validate data schema
    const validationResult = userPlantsSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      )
    }
    
    const plantData = validationResult.data
    
    // Verify the garden belongs to the user
    const garden = await prisma.user_gardens.findFirst({
      where: {
        user_id: userId,
        id: plantData.gardenId
      }
    })
    
    if (!garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    
    // Create new plant tracking entry
    const newPlant = await prisma.user_plants.create({
      data: {
        id: plantData.id || crypto.randomUUID(),
        garden_id: plantData.gardenId,
        nickname: plantData.customName,
        plant_id: plantData.plantId, // This should be the integer ID from main_plant_data table
        care_logs: plantData.careLogs,
        images: plantData.images,
      }
    })
    
    revalidatePath('/api/plant-tracking')
    
    return NextResponse.json({ plant: newPlant }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error creating plant tracking:", error)
    return NextResponse.json(
      { error: "Failed to create plant tracking data" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const data = await request.json()
    
    // Validate data schema
    const validationResult = userPlantsSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      )
    }
    
    const plantData = validationResult.data
    
    if (!plantData.id) {
      return NextResponse.json({ error: "Plant ID is required" }, { status: 400 })
    }
    
    // Verify the garden belongs to the user
    const garden = await prisma.user_gardens.findFirst({
      where: {
        user_id: userId,
        id: plantData.gardenId
      }
    })
    
    if (!garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    
    // Verify the plant exists and belongs to this garden
    const existingPlant = await prisma.user_plants.findFirst({
      where: {
        id: plantData.id,
        garden_id: plantData.gardenId
      }
    })
    
    if (!existingPlant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 })
    }
    
    // Update plant tracking entry
    const updatedPlant = await prisma.user_plants.update({
      where: { id: plantData.id },
      data: {
        nickname: plantData.customName,
        plant_id: plantData.plantId, // This should be the integer ID from main_plant_data table
        care_logs: plantData.careLogs,
        images: plantData.images,
      }
    })
    
    revalidatePath('/api/plant-tracking')
    
    return NextResponse.json({ plant: updatedPlant }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error updating plant tracking:", error)
    return NextResponse.json(
      { error: "Failed to update plant tracking data" },
      { status: 500 }
    )
  }
}
