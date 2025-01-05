import { notFound } from "next/navigation";
import { NextPageProps } from "@/lib/types";
import { getPostsByCategory } from "@/lib/posts";
import { PostType } from "@/lib/types";

type MetadataProps = NextPageProps & {
  postType: PostType;
};

export async function generateMetadata({ params, postType }: MetadataProps) {
  const currentSlug = params.slug;
  const post = getPostsByCategory(postType).find(
    (post) => post.slug === currentSlug
  );

  if (!post) return notFound();
  const { title, description } = post;

  return {
    title,
    description,
  };
}

export function getGenerateMetadata(postType: PostType) {
  return async ({ params }: NextPageProps) => {
    return generateMetadata({ params, postType });
  };
}
