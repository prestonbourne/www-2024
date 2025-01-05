import { getPostsByCategory } from "@/lib/posts";
import { PostType } from "@/lib/types";

export function getGenerateStaticParams(postType: PostType) {
  return () =>
    getPostsByCategory(postType).map((post) => ({
      slug: post.slug,
    }));
}
