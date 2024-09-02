"use client";
import { AnimatePresence, motion } from "framer-motion";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { cx } from "class-variance-authority";
import { usePreventHydrationMismatch } from "@/lib/hooks";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const isHydrated = usePreventHydrationMismatch();
  const oppositeTheme = resolvedTheme === "dark" ? "light" : "dark";

  function handleClick() {
    setTheme(oppositeTheme);
  }

  const buttonClasses = cx(
    "flex justify-center items-center w-8 h-8 rounded-lg",
    "hover:transform hover:scale-125 transition-transform",
    !isHydrated && "animate-pulse"
  );

  const ariaLabel = isHydrated
    ? `Change theme to ${oppositeTheme}`
    : "Loading theme switch";

  return (
    <button
      disabled={!isHydrated}
      suppressHydrationWarning
      aria-label={ariaLabel}
      type="button"
      onClick={handleClick}
      className={buttonClasses}
    >
      {isHydrated ? (
        <AnimatePresence mode="wait">
          {resolvedTheme === "light" && (
            <motion.div
              className="w-6 h-6 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 0.2 }}
              transition={{ duration: 0.1 }}
              key="dark-theme"
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
              key="light-theme"
            >
              <SunIcon />
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="bg-slate-200/20 rounded-full w-6 h-6" />
      )}
    </button>
  );
}
