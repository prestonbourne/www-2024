import { HomeSection } from "@/components/home-section";
import { getPosts } from "@/lib/posts";
import postTypes from "@/post-types.json";

export default async function Page() {
  const description = postTypes.find((post) => post.slug === "sketches")?.description ?? "";
  return (
    <>
      <main>
        <HomeSection
          title="sketches"
          description={description}
          link="/sketches"
          category="sketches"
          posts={await getPosts("sketches")}
          level={1}
        />
      </main>
    </>
  );
}
