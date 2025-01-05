import { getPostsByCategory } from "@/lib/posts";
import { Link } from "@/components/typography/link";
import React from "react";
import type { PostType } from "@/lib/types";
import { trimIsoToDate } from "@/lib";
import * as FadeIn from "@/components/motion";

export type PostListProps = {
  category: PostType;
};

export const PostList = async ({ category }: PostListProps) => {
  const posts = getPostsByCategory(category).sort((a, b) => {
    return (
      new Date(b.publishedAt || Date.now()).getTime() -
      new Date(a.publishedAt || Date.now()).getTime()
    );
  });

  if (posts.length === 0) {
    return null;
  }

  return (
    <FadeIn.Container>
    <ul className="flex flex-col">

        {posts.map((post) => {
          const href = post.externalURL ||`/${category}/${post.slug}`;
          return (
            <FadeIn.Item key={post.slug}>
              <li
                key={post.slug}
                className="flex flex-row justify-between items-center my-2"
          >
            <Link href={href}>
              <p>{post.title}</p>
            </Link>
            <p className="mt-0 text-foreground-muted text-xs">
              {post.publishedAt ? trimIsoToDate(post.publishedAt) : "WIP"}
                </p>
              </li>
            </FadeIn.Item>
          );
        })}
        </ul>
      </FadeIn.Container>
  );
};
