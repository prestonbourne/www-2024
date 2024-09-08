"use client";
import { SketchLite } from "@/lib/sketches/types";
import Image from "next/image";
import { useSketchContext } from "./SketchProvider";
import { motion } from "framer-motion";
import { MotionHeading } from "@/components/typography";

type SketchItemsProps = {
  sketch: SketchLite;
};

export const SketchItem: React.FC<SketchItemsProps> = ({ sketch }) => {
  const { title, description, imageUrl } = sketch;
  const { activeSketch, setActiveSketch } = useSketchContext();
  const isActive = !!(activeSketch && activeSketch.id === sketch.id);

  const handleClick = () => {
    if (isActive) return;
    setActiveSketch(sketch);
  };

  return (
    <motion.li
      aria-disabled={isActive}
      role="button"
        whileHover={{ scale: 1.055 }}
        className="bg-background/10 rounded-sm block shadow-sheen overflow-clip"
        layoutId={`sketch-${sketch.id}`}
        key={`sketch-${sketch.id}-li`}
        onClick={handleClick}
      >
        <motion.div
          className="relative h-40 w-full origin-center"
          key={`sketch-img-${sketch.id}-img`}
        >
          <Image
            src={imageUrl!}
            alt="Sketch Image"
            className="object-cover"
            fill
            sizes="(max-width: 960px) 90vw, 70vw"
          />
        </motion.div>
        <MotionHeading
          layoutId={`sketch-title-${sketch.id}`}
          level={6}
          render="h3"
          className="pl-3 pt-2"
          layout="position"
        >
          {title}
        </MotionHeading>
        <motion.p
          layoutId={`sketch-description-${sketch.id}`}
          className="pl-3 pb-2"
          layout="position"
        >
          {description}
        </motion.p>
      </motion.li>
  );
};
