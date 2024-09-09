import { cva, cx } from "class-variance-authority";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { displayFont } from "@/lib";


// TODO: make this more dynamic OR just throw it in my tailwind config
// use typescale.com to find the right ratio

export const headingStyles = cva(
  cx(displayFont.className, "font-medium antialised"),
  {
    variants: {
      level: {
        1: "text-4xl leading-relaxed font-bold",
        2: "text-3xl leading-relaxed font-bold",
        3: "text-2xl leading-relaxed font-bold",
        4: "text-xl font-bold leading-loose",
        5: "text-lg font-bold",
        6: "text-base font-bold",
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
