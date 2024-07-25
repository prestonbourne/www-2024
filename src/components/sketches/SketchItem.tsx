"use client";
import { Sketch } from "@/lib/sketches/types";
import Image from "next/image";
import { useSketchContext } from "./SketchProvider";
import { AnimatePresence, motion } from "framer-motion";
import { MotionHeading } from "../typography/Heading/motion";

type SketchItemsProps = {
  sketch: Sketch;
  order: number;
};

export const SketchItem: React.FC<SketchItemsProps> = ({ sketch, order }) => {
  const { title, description, imageUrl } = sketch;
  const { activeSketch, setActiveSketch } = useSketchContext();
  const isActive = activeSketch && activeSketch.id === sketch.id;

  return (
    <AnimatePresence>
      {!isActive && (
        <motion.li
          role="button"
          className="bg-background/10 rounded-lg block sheen-ring overflow-clip"
          initial={{ opacity: 0, filter: "blur(4px)", translateY: 20 }}
          animate={{
            translateY: 0,
            filter: "blur(0px)",
            opacity: 1,
            transition: { delay: 0.15 * order },
          }}
          layoutId={`sketch-${sketch.id}`}
          key={`sketch-${sketch.id}`}
          onClick={() => {
            setActiveSketch(sketch);
          }}
        >
          <AnimatePresence>
            <motion.div
              className="relative h-40 w-full origin-center"
              key={`sketch-img-${sketch.id}`}
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
              render="h2"
              className="mb-1 pl-3 pt-2"
              layout="position"
            >
              {title}
            </MotionHeading>
            <motion.p
              layoutId={`sketch-description-${sketch.id}`}
              className="text-sub-text text-sm pl-3 pb-2"
              layout="position"
            >
              {description}
            </motion.p>
          </AnimatePresence>
        </motion.li>
      )}
    </AnimatePresence>
  );
};
