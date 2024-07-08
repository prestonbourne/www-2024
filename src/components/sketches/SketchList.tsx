"use client";
import { Sketch } from "@/lib/sketches/types";
import { SketchItem } from "./SketchItem";
import React, { useEffect, useState } from "react";
import { getSketches } from "@/lib/sketches/getSketches";
import { SketchProvider } from "./SketchProvider";
import { SketchModal } from "./SketchModal";

export const SketchList: React.FC = ({}) => {
  const [sketches, setSketches] = useState<Sketch[]>([]);
  useEffect(() => {
    getSketches().then((sketches) => {
      setSketches(sketches);
    });
  }, []);

  return (
    <SketchProvider>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sketches.map((sketch) => {
          return <SketchItem key={sketch.id} sketch={sketch} />;
        })}
      </ul>
      <SketchModal />
    </SketchProvider>
  );
};
