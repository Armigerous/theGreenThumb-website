import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { GardenService } from "@/lib/services"

// Route Segment Config
export const dynamic = 'force-dynamic' // Always fetch fresh data for user-specific content
export const revalidate = 0 // Disable static caching

/**
 * GET /api/gardens/overview
 * 
 * Reason: Fetch garden overview data for My Garden page including:
 * - All user gardens with statistics
 * - Overall garden statistics
 * - Plants needing care
 */
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Reason: Fetch all garden data in parallel for better performance
    const [gardensWithStats, overallStats] = await Promise.all([
      GardenService.getUserGardensWithStats(userId),
      GardenService.getGardenOverviewStats(userId),
    ])
    
    const response = {
      gardens: gardensWithStats,
      statistics: overallStats,
      plantsNeedingCare: [], // TODO: Implement plants needing care in service layer
    }
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error fetching garden overview:", error)
    return NextResponse.json(
      { error: "Failed to fetch garden overview" },
      { status: 500 }
    )
  }
}
