import { cx } from "class-variance-authority";
import type { ComponentProps } from "react";
import GithubIcon from "./GithubIcon";
import { Link } from "@/components/typography";


export const Footer = ({ className, ...props }: ComponentProps<"footer">) => {
  const year = String(new Date().getFullYear());

  return (
    <footer
      className={cx(
        "w-full mx-auto my-4 py-2",
        className
      )}
      {...props}
    >
      <hr className="w-full mb-4 dark:border-gray-700" />
      <div className="flex flex-row justify-between">
        <GithubIcon />
        <p className="text-sm dark:text-slate-100 text-slate-800">
        © {year} Preston Bourne. <span className="hidden sm:inline">All Rights Reserved.</span>
        </p>
      </div>
    </footer>
  );
};
