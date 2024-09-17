import { DesktopGrid, MobileGrid } from "./grids";
import { getLocalWorks } from "@/lib/work";

export async function WorkGrid() {
  const works = getLocalWorks();
  const sortedWorks = works.sort((a, b) => {
    return (
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
    );
  });

  return (
    <div className="flex gap-2">
      <DesktopGrid sortedWorks={sortedWorks} />
      <MobileGrid sortedWorks={sortedWorks} />
    </div>
  );
}
