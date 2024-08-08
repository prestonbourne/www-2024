import { SketchList } from "@/components/sketches";
import { ContentHeading, Divider } from "@/components";
import type { Metadata } from "next";

const description = "Explorations in forward thinking user interfaces, and interactive/procedural art.";
export const metadata: Metadata = {
  title: "Sketches",
  description,
};

export default async function SketchesHome() {
  return (
    <main>
      <ContentHeading
        title="Sketches"
        description={description}
      />
      <Divider className="mt-2 mb-4" />
      <SketchList />
    </main>
  );
}
