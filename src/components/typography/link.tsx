import { LinkProps as NextLinkProps } from "next/link";
import { Link as NextViewTransitionLink } from "next-view-transitions";
import { ComponentProps } from "react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { cx } from "class-variance-authority";

export type LinkProps = NextLinkProps &
  ComponentProps<"a"> & {
    children: React.ReactNode;
  } & {
    muted?: boolean;
  };

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className,
  muted = false,
  ...props
}) => {
  const isExternal = href.startsWith("http");

  return (
    <NextViewTransitionLink
      target={isExternal ? "_blank" : undefined}
      href={href}
      className={cx(
        "underline decoration-dashed inline-flex flex-row gap-[2px]",
        "transition-all underline-offset-4",
        muted
          ? "text-foreground-muted hover:text-foreground"
          : "text-foreground hover:text-action",
        isExternal && "group items-center",
        className
      )}
      {...props}
    >
      {children}
      {isExternal && (
        <ArrowTopRightIcon
          className={cx(
            "transition-all w-3 group-hover:brightness-110 group-hover:translate-x-[2px]",
            "group-hover:-translate-y-[2px] ease-out"
          )}
        />
      )}
    </NextViewTransitionLink>
  );
};

export const UnstyledLink: React.FC<LinkProps> = ({
  href,
  children,
  className,
  ...props
}) => {
  return <NextViewTransitionLink href={href} className={className} {...props}>{children}</NextViewTransitionLink>;
};
