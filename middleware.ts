// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  if (!url.pathname.startsWith("/plant/")) return NextResponse.next();

  const commonSlug = url.pathname.split("/plant/")[1];
  if (!commonSlug) return NextResponse.next();

  // Fetch scientific_slug using commonSlug from Supabase
  const { data, error } = await supabase
    .from("plant_common_card_data")
    .select("scientific_slug")
    .eq("slug", commonSlug)
    .single();

  if (error || !data) return NextResponse.next();

  // Instead of redirecting, rewrite internally
  // Note: The browser URL remains as /plant/commonSlug
  url.pathname = `/plant/${data.scientific_slug}`;
  return NextResponse.rewrite(url);
}
