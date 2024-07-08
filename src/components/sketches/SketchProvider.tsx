import React, { createContext, useState } from "react";
import { Sketch } from "@/lib/sketches/types";

interface SketchContext {
  activeSketch: Sketch | null;
  setActiveSketch: React.Dispatch<React.SetStateAction<Sketch | null>>;
}

export const SketchContext = createContext<SketchContext | null>(null);

// Create the provider component
export const SketchProvider = ({ children }: { children: any }) => {
  // Define your state and methods here
  const [activeSketch, setActiveSketch] = useState<Sketch | null>(null);

  return (
    <SketchContext.Provider
      value={{
        activeSketch,
        setActiveSketch,
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
