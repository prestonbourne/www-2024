import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ComponentProps } from "react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { cx } from "class-variance-authority";

export type LinkProps = NextLinkProps &
  ComponentProps<"a"> & {
    children: React.ReactNode;
  };

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className,
  ...props
}) => {
  const isExternal = href.startsWith("http");

  return (
    <NextLink
      href={href}
      className={cx(
        "underline decoration-dotted inline-flex flex-row gap-[2px]",
        "transition-all underline-offset-4",
        "dark:text-lime-500 items-center hover:brightness-110",
        isExternal && "group",
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
    </NextLink>
  );
};
