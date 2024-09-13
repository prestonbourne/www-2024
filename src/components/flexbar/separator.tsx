import { cx } from "class-variance-authority";

export type SeperatorProps = {
  orientation: "horizontal" | "vertical";
};

export const Separator = ({ orientation }: SeperatorProps) => {
  const className = cx(
    `border-b border-t-0 border-[1px] border-gray-400 w-6`,
    // orientation === "vertical" && "w-[1px] h-4",
    // orientation === "horizontal" && "h-[1px] w-4"
  );

  return (
    <hr
      data-orientation={orientation}
      className={className}
    />
  );
};
