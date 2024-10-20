import { SketchItem } from "./SketchItem";
import React from "react";
import { getSketchesLite } from "@/lib/sketches/getSketches";
import { SketchProvider } from "./SketchProvider";
import { SketchDialog } from "./dialog";

export const SketchList: React.FC = async () => {
  const sketches = await getSketchesLite();
  const sortedSketches = sketches.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <SketchProvider>
      <ul className="grid grid-cols-2 gap-3">
        {sortedSketches.map((sketch) => {
          return <SketchItem key={sketch.id} sketch={sketch} />;
        })}
      </ul>
      <SketchDialog />
    </SketchProvider>
  );
};
