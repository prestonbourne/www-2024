import { DesktopGrid, MobileGrid } from "./grids";
import { getPostsByCategory } from "@/lib/posts";

export async function PostsGrid() {
  const posts = getPostsByCategory('projects');

  const sortedPosts = posts.sort((a, b) => {
    return (
      new Date(b.publishedAt || Date.now()).getTime() -
      new Date(a.publishedAt || Date.now()).getTime()
    );
  });

  return (
    <div className="flex gap-2">
      <DesktopGrid sortedPosts={sortedPosts} />
      <MobileGrid sortedPosts={sortedPosts} />
    </div>
  );
}
