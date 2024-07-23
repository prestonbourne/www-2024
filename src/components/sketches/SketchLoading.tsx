"use client";
import { motion } from "framer-motion";
import React from "react";
import { Heading } from "../typography";

export const SketchLoading = () => {
  const travelDist = 40;
  return (
    <div className="w-full h-full flex flex-row justify-center items-center min-h-[50vh]">
      <Heading level={2} className="text-center self-start my-56">
        Loading
      </Heading>

      <motion.div
        animate={{
          translateX: [travelDist, -travelDist],
          scale: [1, 1.5, 0.7],
        }}
        transition={{ repeat: Infinity, repeatType: "mirror" }}
        className="absolute w-8 h-8 mix-blend-difference  rounded-full bg-secondary"
      />
      <motion.div
        animate={{
          translateX: [-travelDist, travelDist],
          scale: [1, 1.5, 0.7],
        }}
        transition={{ repeat: Infinity, repeatType: "mirror" }}
        className="absolute w-8 h-8 mix-blend-difference rounded-full bg-primary"
      />
    </div>
  );
};
