import { WorkItemsSwitcher } from "../grid-item";
import type { Work } from "@/lib/work/types";

type WorkGridProps = {
  sortedWorks: Work[];
};

export const DesktopGrid = ({ sortedWorks }: WorkGridProps) => {
  const cols = 2;

  const firstCol = sortedWorks.filter((_, i) => i % cols === 0);
  const secondCol = sortedWorks.filter((_, i) => i % cols === 1)

  // still figuring out how i want to handle the layout, so this gives some nice symmetry
  secondCol.push(firstCol.pop()!)
  firstCol.push(secondCol.pop()!)

  const firstColJSX = firstCol.map((w,i) => {
    return <WorkItemsSwitcher key={i} work={w} />;
  });

  const secondColJSX = secondCol.map((w,i) => {
    return <WorkItemsSwitcher key={i} work={w} />;
  });

  return (
    <div className="lg:flex w-full flex-row gap-3 hidden max-h-[472px]">
      <div className="w-1/2 flex flex-col gap-3">{firstColJSX}</div>
      <div className="w-1/2 flex flex-col gap-3">{secondColJSX}</div>
    </div>
  );
};

export const MobileGrid = ({ sortedWorks }: WorkGridProps) => {

  return (
    <div className="w-full flex flex-col gap-3 lg:hidden">
      {sortedWorks.map((w,i) => {
        return <WorkItemsSwitcher key={i} work={w} />;
      })}
    </div>
  );
};
