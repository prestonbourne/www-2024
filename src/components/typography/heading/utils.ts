import { cva, cx } from "class-variance-authority";
import { DetailedHTMLProps, HTMLAttributes } from "react";


// TODO: make this more dynamic OR just throw it in my tailwind config
// use typescale.com to find the right ratio

export const headingStyles = cva(
  "antialiased text-white",
  {
    variants: {
      level: {
        1: "text-2xl font-bold leading-tight md:text-2xl",
        2: "text-xl font-semibold leading-tight md:text-xl",
        3: "text-lg font-semibold leading-snug",
        4: "text-lg font-medium leading-normal",
        5: "text-sm font-medium leading-normal md:text-sm",
        6: "text-sm font-medium leading-normal md:text-sm",
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
