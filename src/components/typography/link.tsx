import NextLink, { LinkProps as NextLinkProps } from "next/link";
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
    <NextLink
      href={href}
      className={cx(
        "underline decoration-dotted inline-flex flex-row gap-[2px]",
        "transition-all underline-offset-4",
        muted
          ? "dark:text-slate-100 dark:hover:text-slate-300 text-slate-800 hover:text-slate-600"
          : "text-purple-700 dark:text-lime-500 hover:brightness-110",
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
    </NextLink>
  );
};
