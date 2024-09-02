"use client"
import { motion, MotionProps } from "framer-motion";
import React from "react";
import { HeadingProps, headingStyles } from "./utils";


export const MotionHeading: React.FC<HeadingProps & MotionProps> = ({
    level,
    children,
    className = "",
    render,
    ...props
  }) => {
    const HeadingTag = render ?? (`h${level}` as keyof JSX.IntrinsicElements);
  
    return React.createElement(
      // @ts-ignore
    motion[HeadingTag],
    { className: `${headingStyles({ level })} ${className}`, ...props },
    children
  );
};