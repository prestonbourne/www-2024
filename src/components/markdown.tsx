import React from "react";
import { cva } from "class-variance-authority";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { MDXComponents } from "mdx/types";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  ReactElement,
  ComponentProps,
} from "react";
import {
  ExternalLinkIcon,
  ChevronRightIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { CodeBlock, extractCodeEl, extractLang } from "./markdown/CodeBlock";
import { codeToHtml } from "shiki";
import { cx } from "class-variance-authority";

const headingStyles = cva(
  "font-bold text-slate-800 dark:text-white text-black antialised",
  {
    variants: {
      level: {
        1: "text-2xl lg:text-3xl py-4",
        2: "text-xl lg:text-2xl py-3",
        3: "text-lg lg:text-xl py-2",
        4: "text-base lg:text-lg py-2",
        5: "text-lg",
        6: "text-base",
      },
    },
    defaultVariants: {
      level: 1,
    },
  }
);

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  render?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className = "",
  render,
  ...props
}) => {
  const HeadingTag = render ?? (`h${level}` as keyof JSX.IntrinsicElements);

  return React.createElement(
    HeadingTag,
    { className: `${headingStyles({ level })} ${className}`, ...props },
    children
  );
};

export const Body: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <p
      className={cx(
        `text-base leading-relaxed antialiased text-body`,
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export type LinkProps = NextLinkProps &
  ComponentProps<'a'> & {
    children: React.ReactNode;
    icon?: true;
  };

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className,
  icon = false,
  ...props
}) => {
  return (
    <NextLink
      href={href}
      className={cx(
        "underline decoration-dotted inline-flex flex-row items-center gap-1",
        "transition-all underline-offset-4",
        "hover:text-primary hover:decoration-action",
        icon && "group",
        className
      )}
      {...props}
    >
      {children}
      {icon && (
        <ExternalLinkIcon className="transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
      )}
    </NextLink>
  );
};

const TypeToEmoji = {
  error: "🚫",
  info: <InfoCircledIcon />,
  warning: "⚠️",
};

type CalloutType = keyof typeof TypeToEmoji;

const calloutClasses = cva(
  "overflow-x-auto my-6 rounded-md border py-4 px-6 contrast-more:border-current contrast-more:dark:border-current transition-all",
  {
    variants: {
      type: {
        error: "border-red-200 bg-red-500 text-red-900",
        info: "border-blue-500 bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-200",
        warning: "border-yellow-200 bg-yellow-500 text-yellow-900",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

type CalloutProps = {
  type?: CalloutType;
  emoji?: string | ReactNode;
  children: ReactNode;
  title: string;
};

export function Callout({
  children,
  type = "info",
  emoji = TypeToEmoji[type],
  title,
}: CalloutProps): ReactElement {
  const justTitle = !children;

  if (justTitle) {
    return (
      <div className={calloutClasses({ type })}>
        <div className="flex items-center">
          <div className="select-none text-xl mr-3">{emoji}</div>
          <span className="text-lg">{title}</span>
        </div>
      </div>
    );
  }

  return (
    <details className={calloutClasses({ type })}>
      <summary className="flex items-center cursor-pointer">
        <div className="select-none text-xl mr-3">{emoji}</div>
        <span className="font-semibold">{title}</span>
        <ChevronRightIcon className="ml-auto w-5 h-5 arrow-icon" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

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

export const Divider = ({ className }: ComponentProps<"hr">) => {
  return (
    <hr
      className={`border-t border-neutral-300 dark:border-neutral-600 ${className}`}
    />
  );
};

type ImageProps = NextImageProps & {
  src: string;
  alt?: string;
};

const Image = ({ src, alt }: ImageProps) => {
  return (
    <figure className="my-12 overflow-clip rounded-md sheen-ring dark:bg-background/30">
      <figcaption className="block text-sm text-sub-text pl-6 py-2">
        {alt}
      </figcaption>
      <NextImage
        src={src}
        alt={alt}
        layout="reponsive"
        width={0}
        height={0}
        objectFit="contain"
        sizes="100%"
        className="w-full h-auto max-h-[600px]"
      />
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
  img: (props) => {
    /* 
    we don't want to render the image if the src is not a string 
    width and height are extracted just to remove them from the props
    */
    const { src, alt } = props;
    if (typeof src !== "string") {
      return null;
    }
    const imgName = src.split("/").pop()!;

    return <Image alt={imgName} src={src} />;
  },
  p: ({ className = "", ...rest }) => {
    return <Body {...rest} className={`${className} mb-4`} />;
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

export const CustomMDX: React.FC<{ source: string }> = ({ source }) => {
  return <MDXRemote source={source} components={components} />;
};