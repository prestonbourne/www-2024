import { formatISOToDate } from "@/lib/index";
import { NextPageProps } from "@/lib/types";
import { TextWithIcon, TextWithIconLoading } from "@/components/text-with-icon";
import { CalendarIcon, ClockIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Divider } from "@/components/divider";
import { Heading } from "@/components/typography";
import { Paragraph as Body } from "@/components/typography/paragraph";
import { getPostsByCategory, getPostViews } from "@/lib/posts";
import { notFound } from "next/navigation";
import { PostType } from "@/lib/types";
import { MDX } from "@/components/markdown";
import { ViewCounter } from "./view-counter";
import { Suspense } from "react";

type PostPageProps = NextPageProps & {
  postType: PostType;
};

export async function PostPage({ params, postType }: PostPageProps) {
  const currentSlug = params.slug;
  const posts = getPostsByCategory(postType);
  const views = await getPostViews(currentSlug);
  const post = posts.find((post) => post.slug === currentSlug);
  if (!post) return notFound();

  return (
    <article className="mx-auto">
      <header>
        <Heading level={1}>{post.title}</Heading>
        <Body className="text-sm py-2 text-sub-text">{post.description}</Body>
        <div className="flex justify-between my-2 py-0 items-center">
          {post.publishedAt && (
            <TextWithIcon
              text={formatISOToDate(post.publishedAt)}
              Icon={CalendarIcon}
            />
          )}
          <div className="flex gap-4 my-0 py-0 items-center">
            {post.readingTimeMS && (
              <TextWithIcon
                text={`${Math.floor(post.readingTimeMS / 60000)} mins`}
                Icon={ClockIcon}
              />
            )}
            {views && (
              <Suspense fallback={<TextWithIconLoading Icon={EyeOpenIcon} />}>
                <ViewCounter
                  slug={post.slug}
                  initialViews={views}
                  shouldInc={true}
                />
              </Suspense>
            )}
          </div>
        </div>
      </header>
      <Divider className="mt-4 mb-7" />
      <main>
        <MDX source={post.content} />
      </main>
    </article>
  );
}
