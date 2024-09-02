"use client";
import { cx } from "class-variance-authority";
import type { ComponentProps } from "react";
import { useState, useEffect } from "react";
import GithubIcon from "./GithubIcon";
import { Link } from "@/components/typography"
import { usePreventHydrationMismatch } from "@/lib/hooks";

export const Footer = ({ className, ...props }: ComponentProps<"footer">) => {
  const year = String(new Date().getFullYear());

  return (
    <footer
      className={cx(
        "w-screen-md md:pt-0 pt-5 mx-auto mt-4 grid grid-cols-2 gap-y-2",
        className
      )}
      {...props}
    >
      <div className="flex flex-row gap-4 text-sm mb-1">
        <Link
          className="text-sub-text"
          href="https://www.linkedin.com/in/prestonbourne/"
          target="_blank"
          icon
        >
          LinkedIn
        </Link>
        <Link
          href="https://twitter.com/prestonxbourne"
          target="_blank"
          className="text-sub-text"
          icon
        >
          X
        </Link>
      </div>
      <GithubIcon />
        <Clock />
      <p className="text-sm text-sub-text">
        © {year} Preston Bourne. <span className="hidden sm:inline">All Rights Reserved.</span>
      </p>
    </footer>
  );
};

export const Clock = () => {
  const [time, setTime] = useState(new Date());
  const ONE_SECOND = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, ONE_SECOND);

    return () => clearInterval(interval);
  }, []);

  const isHydrated = usePreventHydrationMismatch();
  if(!isHydrated) return null;

  const newYorkTime = time.toLocaleTimeString(undefined, {
    timeZone: "America/New_York",
  });

  return (
    <p className="text-sm">
      EDT🗽 / <time dateTime={newYorkTime} suppressHydrationWarning>{newYorkTime}</time>
    </p>
  );
};
