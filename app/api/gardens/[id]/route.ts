import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { GardenService } from "@/lib/services"

// Route Segment Config
export const dynamic = 'force-dynamic' // Always fetch fresh data for user-specific content
export const revalidate = 0 // Disable static caching

/**
 * GET /api/gardens/[id]
 * 
 * Reason: Fetch detailed information for a specific garden including:
 * - Garden configuration and preferences
 * - All plants in the garden with care status
 * - Plant images and care logs
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { id } = await params;
    const gardenId = parseInt(id)
    
    if (isNaN(gardenId)) {
      return NextResponse.json({ error: "Invalid garden ID" }, { status: 400 })
    }
    
    // Reason: Use service layer to get garden with statistics
    const garden = await GardenService.getGardenById(gardenId, userId)
    const statistics = GardenService.calculateGardenStatistics(garden.user_plants)
    
    const response = {
      ...garden,
      statistics,
    }
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error fetching garden details:", error)
    if (error instanceof Error && error.message === 'Garden not found') {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to fetch garden details" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/gardens/[id]
 * 
 * Reason: Update garden configuration and preferences
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { id } = await params;
    const gardenId = parseInt(id)
    
    if (isNaN(gardenId)) {
      return NextResponse.json({ error: "Invalid garden ID" }, { status: 400 })
    }
    
    const data = await request.json()
    
    // Reason: Use service layer to update garden
    const updatedGarden = await GardenService.updateGarden(gardenId, userId, data)
    
    return NextResponse.json({ garden: updatedGarden })
  } catch (error) {
    console.error("Error updating garden:", error)
    if (error instanceof Error && error.message === 'Garden not found') {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to update garden" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/gardens/[id]
 * 
 * Reason: Delete a garden and all its plants
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { id } = await params;
    const gardenId = parseInt(id)
    
    if (isNaN(gardenId)) {
      return NextResponse.json({ error: "Invalid garden ID" }, { status: 400 })
    }
    
    // Reason: Use service layer to delete garden
    const result = await GardenService.deleteGarden(gardenId, userId)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting garden:", error)
    if (error instanceof Error && error.message === 'Garden not found') {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete garden" },
      { status: 500 }
    )
  }
}