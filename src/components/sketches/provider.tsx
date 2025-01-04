"use client";
import React, { createContext, useEffect, useState } from "react";
import { Sketch, SketchLite } from "@/lib/sketches/types";
import { getSketches } from "@/lib/sketches";

interface SketchContext {
  activeSketch: SketchLite | null;
  SketchComponent: Sketch["Component"] | null;
  setActiveSketch: React.Dispatch<React.SetStateAction<SketchLite | null>>;
}

export const SketchContext = createContext<SketchContext | null>(null);

export const SketchProvider = ({ children }: { children: any }) => {
  const [activeSketch, setActiveSketch] = useState<SketchLite | null>(null);
  const [sketchesMap, setSketchesMap] = useState<Record<string, Sketch>>({});

  const SketchComponent =
    sketchesMap[activeSketch?.id || ""]?.Component || null;

  useEffect(() => {
    getSketches().then((sketches) => {
      const map = sketches.reduce((acc, sketch) => {
        acc[sketch.id] = sketch;
        return acc;
      }, {} as Record<string, Sketch>);
      setSketchesMap(map);
    });
  }, []);

  return (
    <SketchContext.Provider
      value={{
        activeSketch,
        setActiveSketch,
        SketchComponent,
      }}
    >
      {children}
    </SketchContext.Provider>
  );
};

export const useSketchContext = () => {
  const context = React.useContext(SketchContext);
  if (!context) {
    throw new Error("useSketchContext must be used within a SketchProvider");
  }
  return context;
};
