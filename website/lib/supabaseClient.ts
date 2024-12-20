import { createClient } from "@supabase/supabase-js";
import { Database } from "@/supabase/supabase.schema";

const supabaseUrl = "https://yeoeirzikcwwoaquqnfb.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is not set in environment variables.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
