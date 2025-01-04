import NextLink from "next/link";
import { cx } from "class-variance-authority";

export const PersonLink = ({ name, url }: { name: string; url: string }) => {

    const linkClasses = cx(
        "bg-action/10 rounded-sm",
        "text-action",
        "transition-colors hover:brightness-110",
    )
  return (
    <NextLink href={url} target="_blank" className={linkClasses} title={name}>
      @{name}
    </NextLink>
  );
};