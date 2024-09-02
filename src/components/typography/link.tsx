import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ComponentProps } from "react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { cx } from "class-variance-authority";

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
        "hover:text-primary",
        icon && "group",
        className
      )}
      {...props}
    >
      {children}
      {icon && (
        <ExternalLinkIcon className="transition-all group-hover:translate-x-[2px] group-hover:-translate-y-[2px] ease-out" />
      )}
    </NextLink>
  );
};
