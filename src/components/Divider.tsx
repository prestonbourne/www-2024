import { ComponentProps } from "react";
import { cx } from "class-variance-authority";

export const Divider = ({ className }: ComponentProps<"hr">) => {
  return (
    <hr
      className={cx(
        `border-t border-neutral-300 dark:border-neutral-600`,
        className
      )}
    />
  );
};
