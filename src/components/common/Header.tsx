import React from "react";
import { cx } from "class-variance-authority";

type HeaderProps = {
  children: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>;

export const Header: React.FC<HeaderProps> = ({ children, className }) => {
  return <header className={cx(`py-2`, className)}>{children}</header>;
};
