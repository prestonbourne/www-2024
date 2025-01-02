"use client";

import type React from "react";

import { MoonIcon, SunIcon, LaptopIcon } from "@radix-ui/react-icons";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const AppThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const buttons = [
    {
      label: "system",
      icon: <LaptopIcon width={13} />,
      active: theme === "system",
    },
    { label: "dark", icon: <MoonIcon width={13} />, active: theme === "dark" },
    { label: "light", icon: <SunIcon width={13} />, active: theme === "light" },
  ];

  return (
    <span className="flex w-fit items-center gap-0.5 overflow-hidden rounded-[6px] bg-background-surface border border-surface-border p-[2px]">
      {buttons.map(({ label, icon, active }) => (
        <button
          type="button"
          key={label}
          onClick={() => setTheme(label)}
          className={
            `transition-all flex h-6 w-6 items-center justify-center rounded-[4px] hover:brightness-120
            ${active ?  "text-action border-action bg-action/10" : ""}
          `
          }
        >
          {icon}
        </button>
      ))}
    </span>
  );
};

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider
      enableSystem={true}
      attribute="class"
      storageKey="theme"
      defaultTheme="system"
    >
      {children}
    </ThemeProvider>
  );
};
