import "server-only";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Missing env variables for Supabase. Received ${{
      supabaseUrl,
      supabaseKey,
    }}`
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  
});