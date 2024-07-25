"use client";
import { Sketch } from "@/lib/sketches/types";
import { SketchItem } from "./SketchItem";
import React, { useEffect, useState } from "react";
import { getSketches } from "@/lib/sketches/getSketches";
import { SketchProvider } from "./SketchProvider";
import { SketchModal } from "./SketchModal";

export const SketchList: React.FC = ({}) => {
  const [sketches, setSketches] = useState<Sketch[]>([]);
  /* 
  TODO:
  should really be able to use 
  const sketches = await getSketchs
  but since I'm passing a client component as prop... next is complaining
  this artocle seems to give a nice solotion to this problem
  https://frontendatscale.com/blog/donut-components/
  */
  useEffect(() => {
    if (sketches.length > 0) return;
    getSketches().then(setSketches);
  }, [sketches]);

  return (
    <SketchProvider>
      <ul className="grid grid-cols-1 gap-4">
        {sketches.map((sketch, i) => {
          return <SketchItem key={sketch.id} sketch={sketch} order={i} />;
        })}
      </ul>
      <SketchModal />
    </SketchProvider>
  );
};
