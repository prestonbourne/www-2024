import { getPosts } from "@/lib/posts";
import { PostType } from "@/lib/types";

export function getGenerateStaticParams(postType: PostType) {
  return () =>
    getPosts(postType).then((posts) =>
      posts.map((post) => ({
        slug: post.slug,
      }))
    );
}
