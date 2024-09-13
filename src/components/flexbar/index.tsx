"use client";
import React, { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { cx } from "class-variance-authority";
import { useSnap, type SnapPointsType } from "./useSnap";
import {
  HomeIcon,
  BackpackIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";
import { FlexbarItem } from "./item";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import { usePreventHydrationMismatch } from "@/lib/hooks";
import { usePathname } from "next/navigation";
import { Separator } from "./separator";

export const Flexbar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flexbarRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isSelected = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const snapPoints: SnapPointsType = {
    type: "constraints-box",
    unit: "percent",
    points: [
      { x: 0, y: 0.1 },
    ],
  };

  const { dragProps, snapTo } = useSnap({
    direction: "both",
    snapPoints,
    ref: flexbarRef,
    constraints: containerRef,
  });

  const itemClassName = cx(
    `bg-transparent block`,
    `p-4`,
    `dark:hover:bg-gray-200/10 hover:bg-slate-800/10`,
    `cursor-pointer`
  );

  const ThemeIcon = theme === "dark" ? SunIcon : MoonIcon;
  const { hasHydrated } = usePreventHydrationMismatch();

  const toolbarClassName = cx(
    `fixed dark:bg-black/70 rounded-full`,
    `z-40 flex flex-col items-center gap-2 cursor-pointer bg-white/70`,
    `select-none`,
    `backdrop-blur-md overflow-hidden`,
    `dark:shadow-inner-shine shadow-dense dark:border-slate-100/20 border`,
    `transition-opacity -left-16`,
    !hasHydrated &&`opacity-0`,
  );

  useLayoutEffect(() => {
    if (!hasHydrated) return;
    snapTo(0);
    
  }, [hasHydrated, snapTo]);


  return (
    <>
      <div
        ref={containerRef}
        className="top-6 left-6 right-0 bottom-6 fixed pointer-events-none"
      >
        {/* {snapPoints.points.map((p, ind) => (
          <div
            key={ind} // Array is static so it's fine to use index as key
            className="absolute bg-red-800 rounded-full z-50"
            style={{
              top: p.y === undefined ? "0" : (height - 0) * p.y,
              bottom: p.y === undefined ? "0" : undefined,
              left: p.x === undefined ? "0" : (width - 0) * p.x,
              right: p.x === undefined ? "0" : undefined,
              width: p.x === undefined ? undefined : p.y === undefined ? 4 : 8,
              height: p.y === undefined ? undefined : p.x === undefined ? 4 : 8,
            }}
          />
        ))} */}
      </div>

      {/* Flexbar Component */}
        <motion.div
          ref={flexbarRef}
          className={toolbarClassName}
          {...dragProps}
        >
          <FlexbarItem label="Home" active={isSelected("/")}>
            <NextLink href="/" className={itemClassName}>
              <HomeIcon />
            </NextLink>
          </FlexbarItem>
          <FlexbarItem label="Work" active={isSelected("/work")}>
            <NextLink href="/work" className={itemClassName}>
              <BackpackIcon />
            </NextLink>
          </FlexbarItem>
          <Separator orientation={"horizontal"} />
          <FlexbarItem label="Toggle Theme">
            <button onClick={toggleTheme} className={itemClassName}>
              {hasHydrated ? (
                <ThemeIcon />
              ) : (
                <div className="w-4 h-4 animate-pulse bg-gray-500/30 rounded-md" />
              )}
            </button>
          </FlexbarItem>
        </motion.div>
    </>
  );
};
