import { PostListPage } from "@/components/posts/post-list-page";
import { NextPageProps } from "@/lib/types";

const ROUTE = "sketches";

export default function Page({ params }: NextPageProps) {
  return <PostListPage params={params} postType={ROUTE} />;
}

