"use client";
import type React from "react";
import { cx } from "class-variance-authority";
import { MoonIcon, SunIcon, LaptopIcon } from "@radix-ui/react-icons";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ButtonToggle } from "@/components/button-toggle";

export const AppThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themeOptions = [
    {
      label: "system",
      icon: <LaptopIcon width={13} />,
      value: "system",
    },
    { 
      label: "dark",
      icon: <MoonIcon width={13} />,
      value: "dark"
    },
    { 
      label: "light",
      icon: <SunIcon width={13} />,
      value: "light"
    },
  ];

  return (
    <ButtonToggle
      options={themeOptions}
      value={theme || "system"}
      onChange={setTheme}
    />
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
