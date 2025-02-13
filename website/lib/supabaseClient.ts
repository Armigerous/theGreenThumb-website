import { Database } from "@/supabase/supabase.schema";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not set in environment variables.");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is not set in environment variables.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
