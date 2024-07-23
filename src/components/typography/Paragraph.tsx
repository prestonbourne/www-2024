import React from "react";
import { cx } from "class-variance-authority";

export const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
    className = "",
    children,
    ...props
  }) => {
    return (
      <p
        className={cx(
          `text-base leading-relaxed antialiased text-body`,
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  };