import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { MDXComponents } from "mdx/types";
import { ReactElement } from "react";
import { CodeBlock, extractCodeEl, extractLang } from "./CodeBlock";
import { codeToHtml } from "shiki";
import {
  Heading,
  Link,
  Paragraph,
  UnorderedList,
  ListItem,
} from "./typography";
import { Divider } from "./Divider";
import { Video } from "./video";
import { Image } from "./image/image-with-dialog";
import { PersonLink } from "./PersonLink";
import { Callout } from "./callout";



const components: MDXComponents = {
  h1: (props) => <Heading level={1} {...props} />,
  h2: (props) => <Heading level={2} {...props} className="my-4" />,
  h3: (props) => <Heading level={3} {...props} className="my-2" />,
  h4: (props) => <Heading level={4} {...props} className="my-2" />,
  h5: (props) => <Heading level={5} {...props} className="my-1" />,
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
  Video,
  PersonLink,
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

export const WorkMDXRenderer: React.FC<{ source: string }> = ({ source }) => {
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
