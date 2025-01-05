import { createClient } from "@supabase/supabase-js";
import { Database } from "./types.gen";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

if (typeof window !== "undefined" || typeof document !== "undefined") {
  throw Error(`Don't Import this on the client`);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing supabase url");
}

if (!supabaseKey) {
  throw new Error("Missing supabase anon key");
}

export const createAdminClient = () => {
  return createClient<Database>(supabaseUrl, supabaseKey);
};

export const createSSRClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
