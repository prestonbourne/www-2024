"use client";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Missing env variables for Supabase. Received ${{
      supabaseUrl,
      supabaseKey,
    }}`
  );
}
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl!, supabaseKey!);
}
