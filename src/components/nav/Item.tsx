import { ComponentProps } from "react";
import NextLink from "next/link";
import { cx } from "class-variance-authority";

type ItemProps = {
  href: string;
  selected?: boolean;
  label: string;
} & ComponentProps<"li">;

export const Item: React.FC<ItemProps> = ({
  label,
  href,
  selected = false,
}) => {
  console.log(selected)

  const linkClassName = cx(
    "dark:text-white cursor-pointer",
    "transition-all underline-offset-4",
    !selected && "underline decoration-transparent hover:decoration-secondary",
    selected && "underline hover:decoration-primary decoration-primary"
  );

  return (
    <li className={"px-4"}>
      <NextLink href={href} className={linkClassName}>
        {label}
      </NextLink>
    </li>
  );
};
