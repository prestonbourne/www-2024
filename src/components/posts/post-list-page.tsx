import { HomeSection } from "@/components/home-section";
import { getPostsByCategory } from "@/lib/posts";
import { PostType } from "@/lib/types";
import postTypes from "@/post-types.json";
import { NextPageProps } from "@/lib/types";

type PostListPageProps = NextPageProps & {
  postType: PostType;
};

export async function PostListPage({ postType }: PostListPageProps) {
  const description =
    postTypes.find((post) => post.slug === postType)?.description ?? "";
  return (
    <main>
      <HomeSection
        title={postType}
        description={description}
        link={`/${postType}`}
        category={postType}
        posts={getPostsByCategory(postType)}
        level={1}
      />
    </main>
  );
}
