// TEMPORARY: Authentication utility functions for feature flag management
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Feature flag to disable authentication
export const AUTH_ENABLED = false;

/**
 * Get user ID with fallback for disabled auth
 * Returns null when auth is disabled to indicate no authenticated user
 */
export async function getUserId(): Promise<string | null> {
  if (!AUTH_ENABLED) {
    return null;
  }
  
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

/**
 * Handle unauthorized responses when auth is disabled
 * Returns a consistent response indicating the feature is temporarily unavailable
 */
export function handleUnauthorizedResponse(): NextResponse {
  if (!AUTH_ENABLED) {
    return NextResponse.json(
      { 
        error: "Feature temporarily unavailable", 
        message: "This feature is currently disabled for maintenance." 
      }, 
      { status: 503 }
    );
  }
  
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Check if a user is authenticated (always false when auth is disabled)
 */
export function isAuthenticated(userId: string | null): boolean {
  return AUTH_ENABLED && userId !== null;
}