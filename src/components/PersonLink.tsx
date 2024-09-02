import NextLink from "next/link";
import { cx } from "class-variance-authority";

export const PersonLink = ({ name, url }: { name: string; url: string }) => {

    const linkClasses = cx(
        "dark:bg-lime-800/50 rounded-sm",
        "dark:text-lime-500",
        "transition-colors hover:brightness-110",
    )
  return (
    <NextLink href={url} target="_blank" className={linkClasses} title={name}>
      @{name}
    </NextLink>
  );
};