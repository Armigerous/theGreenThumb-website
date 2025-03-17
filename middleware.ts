// middleware.ts
import { supabase } from "@/lib/supabaseClient";
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/chat(.*)', '/chat/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Handle plant URL rewrites
  if (req.nextUrl.pathname.startsWith("/plant/")) {
    const commonSlug = req.nextUrl.pathname.split("/plant/")[1];
    if (commonSlug) {
      // Fetch scientific_slug using commonSlug from Supabase
      const { data, error } = await supabase
        .from("plant_common_card_data")
        .select("scientific_slug")
        .eq("slug", commonSlug)
        .single();

      if (!error && data) {
        // Rewrite the URL internally
        const url = req.nextUrl.clone();
        url.pathname = `/plant/${data.scientific_slug}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // Protect chat routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
