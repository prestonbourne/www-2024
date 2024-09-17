"use server"
import { incrementViewsBySlug } from '.'
import { createAgnosticAdminClient } from '@/lib/supabase/server-client'

export const incrementViewsBySlugAction = (slug: string) => {
  return incrementViewsBySlug(slug, createAgnosticAdminClient())
}
