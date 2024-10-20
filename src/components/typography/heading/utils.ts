import { cva, cx } from "class-variance-authority";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { displayFont } from "@/lib";


// TODO: make this more dynamic OR just throw it in my tailwind config
// use typescale.com to find the right ratio

export const headingStyles = cva(
  cx(displayFont.className, "antialiased"),
  {
    variants: {
      level: {
        1: "text-3xl font-bold leading-tight md:text-4xl",
        2: "text-2xl font-semibold leading-tight md:text-3xl",
        3: "text-xl font-semibold leading-snug md:text-2xl",
        4: "text-lg font-medium leading-normal md:text-xl",
        5: "text-base font-medium leading-normal md:text-lg",
        6: "text-sm font-medium leading-normal md:text-base",
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
