import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { Database } from "./types";

const getEnv = (key: string): string => {
  if (!process.env[key]) {
    throw new Error(`Missing env.${key}`);
  }
  return process.env[key]!;
};

const supabaseUrl = getEnv("SUPABASE_URL");
const supabaseKey = getEnv("SUPABASE_KEY");

export const supabase = (cookies: CookieOptions) => {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
};

export type Supabase = typeof supabase;
export type { CookieOptions };
