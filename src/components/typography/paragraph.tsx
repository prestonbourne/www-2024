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
          `leading-relaxed antialiased text-base dark:text-slate-300 text-slate-800'`,
          className
        )}
        {...props}
      >
        {children}
      </p>
  );
};