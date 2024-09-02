"use client";
import React, { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { cx } from "class-variance-authority";
/* 
ideally id's use compound components here but there was a bug 
that next doesnt seem to plan on fixing anytime soon: https://github.com/orgs/mantinedev/discussions/5872
*/

type ClientImageProps = {
  src: string;
  alt: string;
  caption?: string;
  children: React.ReactNode;
};

type ClientImageContext = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  src: string;
  alt?: string;
  caption?: string;
};

const ClientImageContext = createContext<ClientImageContext | null>(null);

const useImageDialog = () => {
  const context = useContext(ClientImageContext);
  if (!context) {
    throw new Error("useImageDialog must be used within a ImageDialogProvider");
  }
  return context;
};

export const ClientImageProvider = ({
  children,
  src,
  alt,
  caption,
}: ClientImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClientImageContext.Provider
      value={{ isOpen, setIsOpen, src, alt, caption }}
    >
      {children}
    </ClientImageContext.Provider>
  );
};

export const ClientImageDialog = () => {
  const { isOpen, setIsOpen, src, alt, caption } = useImageDialog();
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
        "max-h-[60vh] max-w-none aspect-[9/16] w-[calc(100vw-64px)]", // mobile
        "md:aspect-video mx-auto",
        "top-24 flex flex-col",
        "dark:bg-background/85 backdrop-blur-md backdrop:bg-gray-900/70 border-none",
        "rounded-xl overflow-hidden"
      )}
      onClick={handleClickOutside}
    >
      <div className="w-full h-full relative">
        <NextImage
          src={src}
          alt={alt ?? ""}
          className="w-full h-full object-contain"
          fill
        />
      </div>
    </motion.dialog>
  );
};

type ClientImageClickTargetProps = {
  children: React.ReactNode;
};

export const ClientImageClickTarget = ({
  children,
}: ClientImageClickTargetProps) => {
  const { setIsOpen } = useImageDialog();
  return (
    <div
      aria-label="Open image"
      className="cursor-zoom-in w-full h-full"
      onClick={() => setIsOpen(true)}
    >
      {children}
    </div>
  );
};
