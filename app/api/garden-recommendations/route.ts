import { getUserId, handleUnauthorizedResponse } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return handleUnauthorizedResponse();
    }
    
    // For now, return a simple response indicating the feature is disabled
    return NextResponse.json({
      message: "Garden recommendations are temporarily unavailable",
      recommendations: []
    });
  } catch (error) {
    console.error("Error fetching garden recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch garden recommendations" },
      { status: 500 }
    );
  }
} 