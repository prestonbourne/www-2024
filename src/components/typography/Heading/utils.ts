import { cva } from "class-variance-authority";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

export const headingStyles = cva(
    "font-bold text-slate-800 dark:text-white text-black antialised",
    {
      variants: {
        level: {
          1: "text-2xl lg:text-3xl py-4",
          2: "text-xl lg:text-2xl py-3",
          3: "text-lg lg:text-xl py-2",
          4: "text-base lg:text-lg py-2",
          5: "text-lg",
          6: "text-base",
        },
      },
      defaultVariants: {
        level: 1,
      },
    }
  );
  
  export type HeadingProps = {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    render?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  } & DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;