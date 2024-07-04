"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cx } from "class-variance-authority";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const oppositeTheme = resolvedTheme === "dark" ? "light" : "dark";

  function onThemeChange() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      aria-label={cx("Change theme to", oppositeTheme)}
      type="button"
      onClick={onThemeChange}
      className="flex justify-center items-center w-8 h-8 rounded-lg hover:transform hover:scale-125 transition-transform"
    >
      <AnimatePresence mode="wait">
        {resolvedTheme === "light" && (
          <motion.div
            className="w-6 h-6 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 0.2 }}
            transition={{ duration: 0.1 }}
            key="theme1"
          >
            <MoonIcon />
          </motion.div>
        )}
        {resolvedTheme === "dark" && (
          <motion.div
            className="w-6 h-6 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 0.2 }}
            transition={{ duration: 0.1 }}
            key="theme2"
          >
            <SunIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
