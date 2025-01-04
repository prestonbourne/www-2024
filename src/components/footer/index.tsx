import { cx } from "class-variance-authority";
import { AppThemeSwitcher } from "@/components/providers/theme";
import type { ComponentProps } from "react";
import GithubIcon from "./github-icon";
import { Divider } from "../divider";

export const Footer = ({ className, ...props }: ComponentProps<"footer">) => {
  const year = String(new Date().getFullYear());

  return (
    <footer
      className={cx("w-full mx-auto mb-4 mt-24 py-2", className)}
      {...props}
    >
      <Divider className={"mb-4"} />
      <div className="flex flex-row justify-between items-center">
        <GithubIcon />
        <p className="text-sm">
          © {year} Preston Bourne.{" "}
          <span className="hidden sm:inline">All Rights Reserved.</span>
        </p>
        <AppThemeSwitcher />
      </div>
    </footer>
  );
};
