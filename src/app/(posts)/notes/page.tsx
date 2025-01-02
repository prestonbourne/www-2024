import { PostsGrid } from "@/components/posts/grid";
import { Heading, Paragraph } from "@/components/typography";
import postTypes from "@/post-types.json";

const ROUTE = "notes";

export default function Page() {
  const notes = postTypes.filter((post) => post.slug === ROUTE);
  return (
    <>
      <header className="mb-2">
        <Heading level={1}>notes</Heading>
        <Paragraph>{notes[0].description}</Paragraph>
      </header>
      <main>
        <PostsGrid />
      </main>
    </>
  );
}
