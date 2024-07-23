import { SketchList } from "@/components/sketches";
import { ContentHeading, Divider } from "@/components";

export default async function SketchesHome() {
  return (
    <main>
      <ContentHeading
        title="Sketches"
        description="My explorations into visual computing, procedural, generative and interactive art. At the time of writing, this is my favorite passtime."
      />
      <Divider className="mt-2 mb-4" />
      <SketchList />
    </main>
  );
}
