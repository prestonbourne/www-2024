import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { MDXComponents } from "mdx/types";
import { ReactNode, ReactElement } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { CodeBlock, extractCodeEl, extractLang } from "./CodeBlock";
import { codeToHtml } from "shiki";
import { rehypeImageSize } from "@/lib/rehype/image-size";
import { Heading, Link, Paragraph } from "./typography";
import { Divider } from "./Divider";
import { Callout } from "./Callout";
import ServerImage from "./ServerImage"

type UnorderedListProps = {
  children?: ReactNode;
};

export const UnorderedList: React.FC<UnorderedListProps> = ({ children }) => {
  return <ul className="list-disc ml-6 my-4">{children}</ul>;
};

export const ListItem: React.FC = ({
  children,
}: React.HTMLAttributes<HTMLLIElement>) => {
  return <li className="my-2 text-base">{children}</li>;
};

type ImageProps = NextImageProps & {
  src: string;
  alt?: string;
  width: number;
  height: number;
};

const Image = ({ src, alt, width, height }: ImageProps) => {
  return (
    <figure className="flex flex-col my-12 max-w-full overflow-hidden rounded-md sheen-ring dark:bg-background/30">
      <figcaption className="w-full block text-sm text-sub-text pl-6 py-2">
        {alt}
      </figcaption>
      <div className="w-full relative flex-1">
        <ServerImage
          src={src}
          alt={alt}
          objectFit="contain"
          sizes="100%"
          width={width}
          height={height}
        />
      </div>
    </figure>
  );
};

const components: MDXComponents = {
  h1: (props) => <Heading level={1} {...props} />,
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  h4: (props) => <Heading level={4} {...props} />,
  h5: (props) => <Heading level={5} {...props} />,
  h6: (props) => <Heading level={6} {...props} />,
  p: ({ className = "", ...rest }) => {
    return <Paragraph {...rest} className={`${className} mb-4`} />;
  },
  a: (props) => {
    const { href, children, ...rest } = props;
    if (typeof href !== "string") {
      return (
        <Link href="" {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  },
  ul: (props) => <UnorderedList {...props} />,
  li: (props) => <ListItem {...props} />,
  hr: (props) => <Divider {...props} />,
  Callout,
  Link,
  Image,

  pre: async (props) => {
    const isElement = React.isValidElement(props.children);
    if (!isElement) {
      return <pre {...props} />;
    }
    const codeEl = extractCodeEl(props.children as ReactElement);
    const lang = extractLang(codeEl?.props.className as string);
    const code = await codeToHtml(codeEl?.props.children as string, {
      lang,
      themes: {
        light: "catppuccin-latte",
        dark: "dracula-soft",
      },
    });

    return <CodeBlock code={code} className="sheen-ring rounded-md" />;
  },
};

export const NoteMDXRenderer: React.FC<{ source: string }> = ({ source }) => {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [],
        },
      }}
    />
  );
};
