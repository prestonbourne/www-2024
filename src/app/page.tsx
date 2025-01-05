import { Hero } from "@/components/hero";
import { PostsGrid } from "@/components/posts/grid";
import { HomeSection } from "@/components/home-section";
import * as FadeIn from "@/components/motion";
import postTypes from "@/post-types.json";
import { PostType } from "@/lib/types";
import { getPostsByCategory } from "@/lib/posts";

export default function Page() {
  return (
    <>
      <header>
        <Hero />
      </header>
      <main className="w-full mx-auto flex flex-col gap-6">
        <FadeIn.Container>
          <div className="my-4 flex flex-col gap-24">
            {postTypes.map(async (type) => {
              return (
                <FadeIn.Item key={type.slug}>
                  <HomeSection
                    title={type.title}
                    description={type.description}
                    link={`/${type.slug}`}
                    category={type.slug as PostType}
                    posts={getPostsByCategory(type.slug as PostType)}
                  />
                </FadeIn.Item>
              );
            })}
          </div>
        </FadeIn.Container>
      </main>
    </>
  );
}
