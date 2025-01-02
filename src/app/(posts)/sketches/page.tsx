import { PostsGrid } from "@/components/posts/grid";
import { Heading } from "@/components/typography";

export default function Page() {
  return (
    <>
      <main>
        <Heading level={1}>sketches</Heading>
        <PostsGrid />
      </main>
    </>
  );
}
