import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { UserGardenService } from "@/lib/services"

// Route Segment Config
export const dynamic = 'force-dynamic' // Always fetch fresh data for user-specific content
export const revalidate = 0 // Disable static caching

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Reason: Use service layer to get user garden settings
    const settings = await UserGardenService.getUserGardenSettings(userId)

    if (!settings) {
      return NextResponse.json({ settings: null })
    }

    // Note: For Prisma, we'll return the raw data and handle ID-to-string mapping on the frontend
    // This is more efficient than fetching all lookup tables
    return NextResponse.json({ settings }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error fetching user gardens:", error)
    return NextResponse.json(
      { error: "Failed to fetch user gardens" },
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
    
    // Reason: Use service layer to save user garden settings
    const result = await UserGardenService.saveUserGardenSettings(userId, data)
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error saving user gardens:", error)
    return NextResponse.json(
      { error: "Failed to save user gardens" },
      { status: 500 }
    )
  }
}
