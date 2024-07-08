"use client";
import { Sketch } from "@/lib/sketches/types";
import { Heading } from "../markdown";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSketchContext } from "./SketchProvider";

type SketchItemsProps = {
  sketch: Sketch;
};

export const SketchItem: React.FC<SketchItemsProps> = ({
  sketch,
}) => {
  const { title, description, imageUrl } = sketch
  const { activeSketch, setActiveSketch } = useSketchContext();


  return (
    <>
      <motion.li className="bg-background/10 hover:-translate-y-1 transition-all rounded-lg block sheen-ring overflow-clip">
        <button
          disabled={activeSketch?.id === sketch.id}
          className="text-left"
          onClick={() => {
            setActiveSketch(sketch);
          }}
        >
          <div className="relative h-40 w-full">
            <Image
              src={imageUrl!}
              alt="Sketch Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-4">
            <Heading level={6} render="h2" className="mb-1">
              {title}
            </Heading>
            <p className="text-sub-text text-sm">{description}</p>
          </div>
        </button>
      </motion.li>
    </>
  );
};
