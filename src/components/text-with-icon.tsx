import React, { ComponentProps } from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { cx } from "class-variance-authority";

type TextWithIconProps = {
  text: string | number;
  Icon?: React.ComponentType<IconProps>;
} & ComponentProps<"div">;

export const TextWithIcon = ({ text, Icon, className }: TextWithIconProps) => {
  return (
    <div
      className={cx(
        `text-sm text-sub-text flex flex-row items-center gap-1`,
        className
      )}
    >
      {Icon && (
        <div className="w-4 h-4">
          <Icon />
        </div>
      )}
      {text}
    </div>
  );
};

export const TextWithIconLoading = ({ Icon, className, ...props }: Omit<TextWithIconProps, "text">) => {
  return (
    <div className={cx(`text-sm text-sub-text flex flex-row items-center gap-1`, className)} {...props}>
      {Icon && (
        <div className="w-4 h-4">
          <Icon />
        </div>
      )}
      <div className="w-16 h-3 animate-pulse bg-foreground-muted/30 rounded-sm" />
    </div>
  );
};
