import React, { ComponentProps } from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";

type NoteStatProps = {
  text: string | number;
  Icon?: React.ComponentType<IconProps>;
} & ComponentProps<"div">;

export const NoteStat = ({ text = 0, Icon }: NoteStatProps) => {


  return (
    <div
      className={`text-slate-600 rounded-lg text-sm flex flex-row items-center gap-1`}
    >
      <div className="w-4 h-4">
        {Icon && <Icon className="fill-slate-600" />}
      </div>{" "}
      {text}
    </div>
  );
};
