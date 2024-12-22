import React from "react";
import { headingStyles, type HeadingProps } from "./utils";


export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className = "",
  render,
  showHash = true,
  ...props
}) => {
  const HeadingTag = render ?? (`h${level}` as keyof JSX.IntrinsicElements);

  return React.createElement(
    HeadingTag,
    { className: `${headingStyles({ level, showHash })} ${className}`, ...props },
    children
  );
};

export { MotionHeading } from "./motion";
