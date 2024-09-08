import { SketchItem } from "./SketchItem";
import React from "react";
import { getSketchesLite } from "@/lib/sketches/getSketches";
import { SketchProvider } from "./SketchProvider";
import { SketchModal } from "./SketchModal";

export const SketchList: React.FC = async () => {
  const sketches = await getSketchesLite();

  return (
    <SketchProvider>
      <ul className="grid grid-cols-2 gap-3">
        {sketches.map((sketch) => {
          return <SketchItem key={sketch.id} sketch={sketch} />;
        })}
      </ul>
      <SketchModal />
    </SketchProvider>
  );
};
