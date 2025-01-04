import { PostItemsSwitcher } from "../grid-item";
import type { Post } from "@/lib/types";

type WorkGridProps = {
  sortedPosts: Post[];
};

export const DesktopGrid = ({ sortedPosts }: WorkGridProps) => {
  const cols = 2;

  const firstCol = sortedPosts.filter((_, i) => i % cols === 0);
  const secondCol = sortedPosts.filter((_, i) => i % cols === 1)

  // still figuring out how i want to handle the layout, so this gives some nice symmetry
  secondCol.push(firstCol.pop()!)
  firstCol.push(secondCol.pop()!)

  const firstColJSX = firstCol.map((w,i) => {
    return <PostItemsSwitcher key={i} post={w} />;
  });

  const secondColJSX = secondCol.map((w,i) => {
    return <PostItemsSwitcher key={i} post={w} />;
  });

  return (
    <div className="lg:flex w-full flex-row gap-3 hidden max-h-[472px]">
      <div className="w-1/2 flex flex-col gap-3">{firstColJSX}</div>
      <div className="w-1/2 flex flex-col gap-3">{secondColJSX}</div>
    </div>
  );
};

export const MobileGrid = ({ sortedPosts }: WorkGridProps) => {

  return (
    <div className="w-full flex flex-col gap-3 lg:hidden">
      {sortedPosts.map((w,i) => {
        return <PostItemsSwitcher key={i} post={w} />;
      })}
    </div>
  );
};
