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
        whileHover={{ scale: 1.035 }}
        className="bg-background rounded-sm shadow-sheen overflow-clip cursor-pointer h-60 flex flex-col"
        layoutId={`sketch-${sketch.id}`}
        key={`sketch-${sketch.id}-li`}
        onClick={handleClick}
      >
        <motion.div
          className="relative w-full flex-grow"
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
        <div className="p-2 flex flex-col max-h-48">
          <MotionHeading
            layoutId={`sketch-title-${sketch.id}`}
            level={6}
            render="h3"
            layout="position"
            className="truncate"
          >
            {title}
          </MotionHeading>
          <motion.p
            layoutId={`sketch-description-${sketch.id}`}
            layout="position"
            className="line-clamp-1"
          >
            {description}
          </motion.p>
        </div>
    </motion.li>
  );
};
