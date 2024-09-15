import { createClient } from '@supabase/supabase-js'
import { Database } from './types.gen'

if (typeof window !== 'undefined') {
  throw Error(`Don't Import this on the client`)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl) {
  throw new Error('Missing supabase url')
}

if (!supabaseKey) {
  throw new Error('Missing supabase anon key')
}

export const createAgnosticAdminClient = () => {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      fetch: (url, init) =>
        fetch(url, {
          cache: 'no-store',
          next: {
            tags: ['supabase_work'],
          },
          ...init,
        }),
    },
  })
}
