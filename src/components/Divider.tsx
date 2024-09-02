import { ComponentProps } from "react";
import { cx } from "class-variance-authority";

export const Divider = ({ className }: ComponentProps<"hr">) => {
  return (
    <hr
      className={cx(
        `border-t border-gray-700 dark:border-gray-500`,
        className
      )}
    />
  );
};
