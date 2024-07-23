"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useSketchContext } from "./SketchProvider";
import { Heading, Body } from "../markdown";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactEventHandler } from "react";

export const SketchModal: React.FC = ({}) => {
  const { activeSketch, setActiveSketch } = useSketchContext();

  const shouldRender = !!(activeSketch && activeSketch.Component);

  const isOnClient = typeof window !== "undefined";
  if (!isOnClient) return null;

  const handleCancel: ReactEventHandler<HTMLDialogElement> = (evt) => {
    evt.preventDefault();
    setActiveSketch(null);
  };

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.dialog
          ref={(node) => {
            node?.showModal();
          }}
          initial={{
            opacity: 0,
            translateX: "-50%",
            translateY: "-50%",
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            translateY: "-75%",
            scale: 1,
            transition: {
              type: "tween",
              duration: 0.175,
              easings: "easeInOut",
            }
          }}
          exit={{
            opacity: 0,
            translateY: "-20%",
            scale: 0.64,
            transition: {
              type: "tween",
              duration: 0.125,
            },
          }}
          onCancel={handleCancel}
          className="flex flex-col w-[90vw] h-[50vh] bg-slate-100/60 dark:bg-background/65 backdrop:backdrop-blur-sm p-2 top-1/2 left-1/2 rounded-lg backdrop:bg-background/80 sheen-ring"
        >
          <div className="ml-2 flex items-center justify-between pb-1">
            <Heading render="h1" level={4} className="pb-0">
              {activeSketch.title}
            </Heading>
            <button
              className="w-7 h-7 mx-2 flex items-center justify-center group"
              onClick={() => setActiveSketch(null)}
            >
              <div className="bg-red-500 rounded-full transition-colors p-1">
                <Cross2Icon className="opacity-0 group-hover:opacity-100 transition-opacity w-2 h-2" />
              </div>
            </button>
          </div>
          <Body className="pl-2 pb-2">{activeSketch.description}</Body>
          <div className="w-full h-full rounded-md overflow-hidden">
            <activeSketch.Component />
          </div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
};
