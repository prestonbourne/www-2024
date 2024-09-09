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
import * as Separator from "@radix-ui/react-separator";
import { FlexbarItem } from "./item";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import { usePreventHydrationMismatch } from "@/lib/hooks";
import { usePathname } from "next/navigation";

export const Flexbar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isSelected = (path: string) => {
    return pathname === path;
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const snapPoints: SnapPointsType = {
    type: "constraints-box",
    unit: "percent",
    points: [
      { x: 0.5, y: 1 },
      { x: 0.5, y: 0 },
    ],
  };

  const { dragProps, snapTo, motionState } = useSnap({
    direction: "both",
    snapPoints,
    ref: toolbarRef,
    constraints: containerRef,
  });

  const itemClassName = cx(
    `bg-transparent block`,
    `p-4`,
    `dark:hover:bg-gray-200/10 hover:bg-slate-800/10`,
    `cursor-pointer`
  );

  const ThemeIcon = theme === "dark" ? SunIcon : MoonIcon;

  const themeToggleClassName = cx(itemClassName);

  const { hasHydrated } = usePreventHydrationMismatch();

  useLayoutEffect(() => {
    if (!hasHydrated) return;
    snapTo(0);
    
  }, [hasHydrated, snapTo]);

  const toolbarClassName = cx(
    `fixed dark:bg-gray-950/90 rounded-full`,
    `z-40 flex items-center gap-2 cursor-pointer bg-white/70`,
    `select-none my-4 -bottom-72 left-1/2`,
    `backdrop-blur-md overflow-hidden`,
    `dark:shadow-inner-shine shadow-dense`,
  );

  return (
    <>
      <div
        ref={containerRef}
        className="top-0 left-0 fixed w-[calc(100vw-4rem)] h-[calc(100vh-4rem)] m-4 pointer-events-none"
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
      <motion.div ref={toolbarRef} className={toolbarClassName} {...dragProps}>
        <FlexbarItem label="Home" active={isSelected("/")}>
          <NextLink href="/" className={itemClassName}>
            <HomeIcon />
          </NextLink>
        </FlexbarItem>
        {/* <FlexbarItem label="Notes" active={isSelected("/notes")}>
          <NextLink href="/notes" className={itemClassName}>
            <Pencil1Icon />
          </NextLink>
        </FlexbarItem> */}
        <FlexbarItem label="Work" active={isSelected("/work")}>
          <NextLink href="/work" className={itemClassName}>
            <BackpackIcon />
          </NextLink>
        </FlexbarItem>
        <Separator.Root
          orientation="vertical"
          className="bg-gray-500 rounded-full h-4 w-[1px]"
        />
        <FlexbarItem label="Toggle Theme" >
          <button onClick={toggleTheme} className={themeToggleClassName}>
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
