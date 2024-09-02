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
          `text-lg leading-relaxed antialiased`,
          className
        )}
        {...props}
      >
        {children}
      </p>
  );
};