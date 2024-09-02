"use client";

import React, { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { cx } from "class-variance-authority";

type ClientVideoProps = {
  src: string;
  caption?: string;
  children: React.ReactNode;
};

type ClientVideoContext = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  src: string;
  caption?: string;
};

const ClientVideoContext = createContext<ClientVideoContext | null>(null);

const useVideoDialog = () => {
  const context = useContext(ClientVideoContext);
  if (!context) {
    throw new Error("useVideoDialog must be used within a VideoDialogProvider");
  }
  return context;
};

export const ClientVideoProvider = ({
  children,
  src,
  caption,
}: ClientVideoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClientVideoContext.Provider value={{ isOpen, setIsOpen, src, caption }}>
      {children}
    </ClientVideoContext.Provider>
  );
};

export const ClientVideoDialog = () => {
  const { isOpen, setIsOpen, src, caption } = useVideoDialog();
  if (!isOpen) return null;

  const handleClickOutside = (evt: React.MouseEvent<HTMLDialogElement>) => {
    const bounds = evt.currentTarget.getBoundingClientRect();
    if (
      evt.clientX < bounds.x ||
      evt.clientX > bounds.x + bounds.width ||
      evt.clientY < bounds.y ||
      evt.clientY > bounds.y + bounds.height
    ) {
      setIsOpen(false);
    }
  };

  return (
    <motion.dialog
      ref={(node) => node?.showModal()}
      className={cx(
        "max-h-[80vh] max-w-none w-[calc(100vw-64px)]", // mobile
        "mx-auto",
        "top-24 flex flex-col",
        "dark:bg-background/85 backdrop-blur-md backdrop:bg-gray-900/70 border-none",
        "rounded-xl overflow-hidden"
      )}
      onClick={handleClickOutside}
    >
      <div className="w-full h-full relative">
        <video
          src={src}
          controls
          className="w-full h-full object-contain"
        />
      </div>
      {caption && (
        <div className="px-4 py-2 text-sm text-center text-sub-text">
          {caption}
        </div>
      )}
    </motion.dialog>
  );
};

type ClientVideoClickTargetProps = {
  children: React.ReactNode;
};

export const ClientVideoClickTarget = ({
  children,
}: ClientVideoClickTargetProps) => {
  const { setIsOpen } = useVideoDialog();
  return (
    <div
      aria-label="Open video"
      className="cursor-pointer w-full h-full"
      onClick={() => setIsOpen(true)}
    >
      {children}
    </div>
  );
};
