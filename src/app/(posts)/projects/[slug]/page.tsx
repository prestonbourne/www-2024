import React from "react";
import { notFound } from "next/navigation";
import { MDX } from "@/components/markdown";
import { formatISOToDate } from "@/lib/index";

import { NextPageProps } from "@/lib/types";
import { TextWithIcon } from "@/components/text-with-icon";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { Divider } from "@/components/divider";
import { Heading } from "@/components/typography";
import { Paragraph as Body } from "@/components/typography/paragraph";
import { ClientViewCount } from "@/components/posts/view-count";
import { Breadcrumb } from "@/components/breadcrumb";
import { getPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts("projects").then((posts) =>
    posts.map((post) => ({
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: NextPageProps) {
  const currentSlug = params.slug;
  const posts = await getPosts("projects");
  const post = posts.find((post) => post.slug === currentSlug);

  if (!post) return notFound();
  const { title, description } = post;

  return {
    title,
    description,
  };
}

export default async function Page({ params }: NextPageProps) {
  const currentSlug = params.slug;
  const posts = await getPosts("projects");
  const post = posts.find((post) => post.slug === currentSlug);

  if (!post) return notFound();

  return (
    <>
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
              {/* <ClientViewCount shouldIncrement slug={currentSlug} /> */}
            </div>
          </div>
        </header>
        <Divider className="mt-4 mb-7" />
        <main>
          <MDX source={post.content} />
        </main>
      </article>
    </>
  );
}
