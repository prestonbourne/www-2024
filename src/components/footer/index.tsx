"use client";
import { cx } from "class-variance-authority";
import type { ComponentProps } from "react";
import { useState, useEffect } from "react";
import GithubIcon from "./GithubIcon";
import { Link } from "../markdown";

export const Footer = ({ className, ...props }: ComponentProps<"footer">) => {
  const year = String(new Date().getFullYear());

  return (
    <footer
      className={cx(
        "grid grid-cols-2 gap-y-2 justify-between w-full md:pt-0 pt-5 mx-auto px-4 mt-4",
        className
      )}
      {...props}
    >
      <div className="flex flex-row gap-4">
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
        <Link
          href="https://sketches.prestonbourne.dev"
          target="_blank"
          className="text-sub-text"
          icon
        >
          Sketches
        </Link>
      </div>
      <GithubIcon />
      <Clock />

      <p className="text-sub-text text-sm text-right">
        © {year} Preston Bourne
      </p>
    </footer>
  );
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const ONE_SECOND = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, ONE_SECOND);

    return () => clearInterval(interval);
  }, []);

  const newYorkTime = time.toLocaleTimeString(undefined, {
    timeZone: "America/New_York",
  });

  return (
    <p className="text-sub-text text-sm">
      EDT / <time dateTime={newYorkTime}>{newYorkTime}</time>
    </p>
  );
};
