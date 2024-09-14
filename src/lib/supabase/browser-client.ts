import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types.gen'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Missing env variables for Supabase. Received ${{
      supabaseUrl,
      supabaseKey,
    }}`
  )
}
/**
 * Uses singleton under the hood so its safe to call repeatedly
 */
export const getClient = () => {
  return createBrowserClient<Database>(supabaseUrl!, supabaseKey!, {
    global: {
      fetch: (url: any, options = {}) => {
        return fetch(url, { ...options, cache: 'no-store' })
      },
    },
  })
}
