import { getPostsByCategory } from "@/lib/posts";
import { createAdminClient } from "@/lib/supabase/server-client";
import { PostType } from "@/lib/types";
import { inspect } from "node:util";
import { loadEnvConfig } from "@next/env";

export default async function runner ({ env }: { env: typeof process.env }) {
  loadEnvConfig(process.cwd(), true, console);
  const TYPES: PostType[] = ["projects", "notes", "sketches"];
  const supabase = createAdminClient();

  for (const type of TYPES) {
    const localPosts = getPostsByCategory(type);
    for (const post of localPosts) {
      const { error } = await supabase.from("posts").upsert(
        {
          slug: post.slug,
          type,
          title: post.title,
          content_mdx: post.content,
          description: post.description,
          external_url: post.externalURL,
          published_at: post.publishedAt,
          updated_at: post.updatedAt,
        },
        {
          onConflict: "slug",
          ignoreDuplicates: false,
        }
      );
      if (error) {
        console.error(inspect(error, { showHidden: true, depth: null }));
      }
    }
  }
}
