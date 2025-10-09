import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { PlantService } from "@/lib/services"

// Route Segment Config
export const dynamic = 'force-dynamic' // Always fetch fresh data for user-specific content
export const revalidate = 0 // Disable static caching

/**
 * GET /api/gardens/[id]/recommendations
 * 
 * Reason: Get plant recommendations for a specific garden based on:
 * - Garden configuration and preferences
 * - Existing plants in the garden
 * - Environmental conditions
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
    
    // Reason: Use service layer to get garden recommendations
    const result = await PlantService.getGardenRecommendations(gardenId, userId)
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error fetching garden recommendations:", error)
    if (error instanceof Error && error.message === 'Garden not found') {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to fetch garden recommendations" },
      { status: 500 }
    )
  }
}
