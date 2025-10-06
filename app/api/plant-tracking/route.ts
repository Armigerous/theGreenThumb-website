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
  botanicalName: z.string().min(1, "Botanical name is required"),
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
    const garden = await prisma.userGardens.findFirst({
      where: {
        userId,
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
      plants = await prisma.userPlants.findMany({
        where: { gardenId: parseInt(gardenId) },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // Otherwise find all plants from all gardens owned by the user
      const userGardensData = await prisma.userGardens.findMany({
        where: { userId },
        include: {
          userPlants: {
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' }
          }
        }
      })
      
      // Flatten the plants from all gardens
      plants = userGardensData.flatMap(garden => garden.userPlants || [])
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
    const garden = await prisma.userGardens.findFirst({
      where: {
        userId,
        id: plantData.gardenId
      }
    })
    
    if (!garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    
    // Create new plant tracking entry
    const newPlant = await prisma.userPlants.create({
      data: {
        id: plantData.id || crypto.randomUUID(),
        gardenId: plantData.gardenId,
        customName: plantData.customName,
        botanicalName: plantData.botanicalName,
        status: plantData.status,
        careLogs: plantData.careLogs,
        images: plantData.images,
        locationTags: plantData.locationTags,
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
    const garden = await prisma.userGardens.findFirst({
      where: {
        userId,
        id: plantData.gardenId
      }
    })
    
    if (!garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    
    // Verify the plant exists and belongs to this garden
    const existingPlant = await prisma.userPlants.findFirst({
      where: {
        id: plantData.id,
        gardenId: plantData.gardenId
      }
    })
    
    if (!existingPlant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 })
    }
    
    // Update plant tracking entry
    const updatedPlant = await prisma.userPlants.update({
      where: { id: plantData.id },
      data: {
        customName: plantData.customName,
        botanicalName: plantData.botanicalName,
        status: plantData.status,
        careLogs: plantData.careLogs,
        images: plantData.images,
        locationTags: plantData.locationTags,
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
