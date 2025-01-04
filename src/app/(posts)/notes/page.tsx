import { Heading, Paragraph } from "@/components/typography";
import postTypes from "@/post-types.json";
import { PostList } from "@/components/post-list";

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
        <PostList category={ROUTE} />
      </main>
    </>
  );
}
