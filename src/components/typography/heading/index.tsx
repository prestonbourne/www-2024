import React from "react";
import { headingStyles, type HeadingProps } from "./utils";
import { cx } from "class-variance-authority";


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
    { className: cx(headingStyles({ level, showHash }), className), ...props },
    children
  );
};

export { MotionHeading } from "./motion";
