import { NextPageProps } from "@/lib/types";
import { PostPage } from "@/components/posts/post-page";
import { getGenerateMetadata } from "@/components/posts/metadata-slug";
import { getGenerateStaticParams } from "@/components/posts/static-params-slug";

const CURRENT_SLUG = "projects";

export const generateMetadata = getGenerateMetadata(CURRENT_SLUG);
export const generateStaticParams = getGenerateStaticParams(CURRENT_SLUG);

export default async function Page({ params }: NextPageProps) {
  return <PostPage params={params} postType={CURRENT_SLUG} />;
}
