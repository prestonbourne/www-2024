"use client";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useSketchContext } from "./SketchProvider";
import { Heading, Body } from "../markdown";
import { Cross2Icon } from "@radix-ui/react-icons";


export const SketchModal: React.FC = ({}) => {
  const { activeSketch, setActiveSketch } = useSketchContext();

  const shouldRender = !!(activeSketch && activeSketch.Component);

  return createPortal(
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          layout
          initial={{
            opacity: 0,
            transform: "translate(-50%,-50%)",
          }}
          animate={{
            opacity: 1,
            transform: "translate(-50%,calc(-50% - 96px))",
          }}
          exit={{
            opacity: 0,
            transform: "translate(-50%,-50%)",
          }}
          className="fixed w-[90vw] max-h-[70vh] bg-background/65 backdrop-blur-md p-2 top-1/2 left-1/2 rounded-lg"
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
          <activeSketch.Component />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
