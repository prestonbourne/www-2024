import { Hero } from "@/components/hero";
import { PostsGrid } from "@/components/posts/grid";
import {
  Heading,
  Paragraph,
  UnstyledLink as Link,
} from "@/components/typography";
import { ComponentProps } from "react";
import * as FadeIn from "@/components/motion";
import postTypes from "@/post-types.json";
import { PostList } from "@/components/post-list";
import { Post, PostType } from "@/lib/types";
import { getPosts } from "@/lib/posts";
import { Divider } from "@/components/divider";



export default function Page() {
  return (
    <>
      <header>
        <Hero />
      </header>
      <main className="w-full mx-auto flex flex-col gap-6">
        <FadeIn.Container>
          <div className="my-4 flex flex-col gap-24">
            {postTypes.map((type) => {
              return (
                <FadeIn.Item key={type.slug}>
                  <HomeSection
                    title={type.title}
                    description={type.description}
                    link={`/${type.slug}`}
                    category={type.slug as PostType}
                    posts={getPosts(type.slug as PostType)}
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

type HomeSectionProps = ComponentProps<"section"> & {
  description: string;
  link: string;
  category: PostType;
  posts: Post[];
};

export const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  description,
  link,
  category,
  posts,
  ...rest
}) => {
  return (
    <section {...rest}>
      <Heading level={2}>
        <Link
          href={link}
          className="hover:text-foreground-muted transition-colors duration-150"
        >
          {title}
        </Link>
      </Heading>
      <Paragraph >{description}</Paragraph>
      <Divider className="my-4" />
      <PostList category={category} />
    </section>
  );
};
