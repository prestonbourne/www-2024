"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useSketchContext } from "./SketchProvider";
import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";
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

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.dialog
        onClick={onClickOutside}
          ref={(node) => {
            node?.showModal();
          }}
          layoutId={`sketch-${activeSketch.id}`}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              type: "tween",
              duration: .01,
              easings: "easeOut",
            },
          }}
          onCancel={handleCancel}
          className="mx-auto top-48 flex flex-col w-[90vw] h-[50vh] bg-slate-100/90 dark:bg-background/65 backdrop:backdrop-blur-sm p-2 rounded-lg backdrop:bg-black/25 backdrop:dark:bg-background/80 sheen-ring"
        >
          <div className="ml-2 flex items-center justify-between pb-1">
            <Heading
              render="h1"
              level={4}
              className="pb-0"
            >
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
          <Paragraph className="pl-2 pb-2">
            {activeSketch.description}
          </Paragraph>
          <motion.div
            className="w-full h-full rounded-md overflow-hidden"
            layoutId={`sketch-img-${activeSketch.id}`}
          >
            <activeSketch.Component />
          </motion.div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
};
