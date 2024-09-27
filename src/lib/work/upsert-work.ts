import { WorkWithRoute } from "./types"
import { SupabaseClient } from "../supabase/types"

// this has to be seperate since we import it in a build script it was causing a circular dependency

export async function upsertWork(
    work: WorkWithRoute,
    supabase: SupabaseClient
  ): Promise<void> {
    const upsertData = {
      slug: work.slug,
      publish_date: work.metadata.publishedAt,
      description: work.metadata.description,
      content: work.content,
      views_count: work.views,
      likes_count: work.likes,
    }
  
    const { error } = await supabase
      .from('work')
      .upsert(upsertData, { onConflict: 'slug' })
  
    if (error) {
      console.error('Error upserting work', error)
      throw error
    }
  }