import React, { ComponentProps } from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";

type NoteStatProps = {
  text: string | number;
  Icon?: React.ComponentType<IconProps>;
} & ComponentProps<"div">;

export const NoteStat = ({ text = 0, Icon }: NoteStatProps) => {
  return (
    <div className={`text-sm text-sub-text flex flex-row items-center gap-1`}>
      {Icon && (
        <div className="w-4 h-4">
          <Icon />
        </div>
      )}
      {text}
    </div>
  );
};

export const NoteStatLoading = ({ Icon, text }: NoteStatProps) => {
  return (
    <div className={`text-sm text-sub-text flex flex-row items-center gap-1`}>
      {Icon && (
        <div className="w-4 h-4">
          <Icon />
        </div>
      )}
      <div className="w-5 h-3 animate-pulse bg-body/20 rounded-sm" />
      <span className="sr-only">{text}</span>
    </div>
  );
};
