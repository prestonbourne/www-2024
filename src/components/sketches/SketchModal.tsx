"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useSketchContext } from "./SketchProvider";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactEventHandler } from "react";
import { cx } from "class-variance-authority";
import { MotionHeading } from "@/components/typography/Heading/motion";

export const SketchModal: React.FC = ({}) => {
  const { activeSketch, setActiveSketch } = useSketchContext();

  const shouldRender = !!(activeSketch && activeSketch.Component);

  const isOnClient = typeof window !== "undefined";
  if (!isOnClient) return null;

  const handleCancel: ReactEventHandler<HTMLDialogElement> = (evt) => {
    evt.preventDefault();
    setActiveSketch(null);
  };

  const onClickOutside = (evt: React.MouseEvent<HTMLDialogElement>) => {
    const bounds = evt.currentTarget.getBoundingClientRect();
    if (
      evt.clientX < bounds.x ||
      evt.clientX > bounds.x + bounds.width ||
      evt.clientY < bounds.y ||
      evt.clientY > bounds.y + bounds.height
    ) {
      setActiveSketch(null);
    }
  };
  /* 
  TODO:
  would love to be able to customize exit animations here
  but framer seems to just ignore the exit: {transitions} prop
  */

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.dialog
          onClick={onClickOutside}
          ref={(node) => node?.showModal()}
          layoutId={`sketch-${activeSketch.id}`}
          key={`sketch-${activeSketch.id}`}
          onCancel={handleCancel}
          className={cx(
            "max-h-[60vh] max-w-none aspect-[9/16] w-[calc(100vw-32px)]",// mobile
            "md:w-[90vw] md:aspect-video md:max-w-screen-2xl mx-auto",
            "top-24 flex flex-col",
            "bg-slate-100/90 dark:bg-background/85 backdrop-blur-sm",
            "p-2 rounded-lg sheen-ring overflow-hidden",
          )}
        >
          <button
            className="w-7 h-7 mb-2 flex items-center justify-center group" // wider so easier to click
            onClick={() => setActiveSketch(null)}
          >
            <div className="bg-red-500 rounded-full p-[1px] transition-colors text-red-900">
              <Cross2Icon className="opacity-0 group-hover:opacity-100 transition-opacity w-3 h-3" />
            </div>
          </button>
          <motion.div
            className="w-full h-full rounded-md overflow-hidden"
            transition={{ duration: 0.125 }}
            exit={{ transition: { duration: 0.125 } }}
          >
            <activeSketch.Component />
          </motion.div>
          <MotionHeading
            render="h1"
            level={4}
            className="pb-0 pl-1"
            key={`sketch-title-${activeSketch.id}`}
            layoutId={`sketch-title-${activeSketch.id}`}
            layout="position"
          >
            {activeSketch.title}
          </MotionHeading>
          <motion.p
          className="pl-1"
            layoutId={`sketch-description-${activeSketch.id}`}
            layout="position"
          >
            {activeSketch.description}
          </motion.p>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
};
