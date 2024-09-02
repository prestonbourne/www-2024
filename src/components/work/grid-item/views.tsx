import { EyeOpenIcon } from "@radix-ui/react-icons";
import { ComponentProps } from "react";
import { cx } from "class-variance-authority";

type WorkItemViewsProps = ComponentProps<"div">;

export function WorkItemViews({ className }: WorkItemViewsProps) {
  const classes = cx(
    `absolute top-2 left-2 text-xs flex items-center gap-1 text-white bg-gray-950/80 px-2 py-1 rounded-full shadow-dense`,
    className
  );

  return (
    <div className={classes}>
      <EyeOpenIcon />
      <div>100</div>
    </div>
  );
}
