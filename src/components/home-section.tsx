import {
  Heading,
  Paragraph,
  UnstyledLink as Link,
} from "@/components/typography";
import { ComponentProps } from "react";
import { PostList } from "@/components/post-list";
import { Post, PostType } from "@/lib/types";
import { Divider } from "@/components/divider";
import type { HeadingProps } from "./typography/heading/utils";

type HomeSectionProps = ComponentProps<"section"> & {
    title: string;
    description: string;
    link: string;
    category: PostType;
    posts: Post[];
    level?: HeadingProps["level"];
  };
  
  export const HomeSection: React.FC<HomeSectionProps> = ({
    title,
    level = 2,
    description,
    link,
    category,
    posts,
    ...rest
  }) => {
    return (
      <section {...rest}>
        <Heading level={level}>
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
  