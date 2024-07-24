"use client";
import { Sketch } from "@/lib/sketches/types";
import { Heading } from "@/components/typography/Heading";
import Image from "next/image";
import { useSketchContext } from "./SketchProvider";
import { motion } from "framer-motion";

type SketchItemsProps = {
  sketch: Sketch;
};

export const SketchItem: React.FC<SketchItemsProps> = ({ sketch }) => {
  const { title, description, imageUrl } = sketch;
  const { activeSketch, setActiveSketch } = useSketchContext();

  return (
    <motion.li
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      className="bg-background/10 rounded-lg block sheen-ring overflow-clip"
      layoutId={`sketch-${sketch.id}`}
    >
      <button
        disabled={activeSketch?.id === sketch.id}
        className="text-left w-full"
        onClick={() => {
          setActiveSketch(sketch);
        }}
      >
        <motion.div
          className="relative h-40 w-full"
          layoutId={`sketch-img-${sketch.id}`}
        >
          <Image src={imageUrl!} alt="Sketch Image" objectFit="cover" fill />
        </motion.div>
        <div className="p-4">
          <Heading level={6} render="h2" className="mb-1">
            {title}
          </Heading>
          <p className="text-sub-text text-sm">{description}</p>
        </div>
      </button>
    </motion.li>
  );
};
