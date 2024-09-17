import { SupabaseClient as _SupabaseClient } from '@supabase/supabase-js'
import { Database } from './types.gen'

export type SupabaseClient = _SupabaseClient<Database>
