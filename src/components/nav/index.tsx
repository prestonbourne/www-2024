"use client";
import React from "react";
import { Item } from "./Item";
import { usePathname } from "next/navigation";
import { Header } from "../common";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";

const ITEMS = [{ href: "/notes", label: "/notes" }];

export const Nav: React.FC = () => {
  const pathname = usePathname();

  return (
    <Header>
      <nav className="mx-auto mt-4 mb-8 flex items-center justify-between">
        <HomeButton />
        <div className="flex flex-row items-center justify-center gap-4">
          <ul>
            {ITEMS.map((item, i) => (
              <Item
                key={i}
                href={item.href}
                label={item.label}
                selected={isSelected(pathname, item.href)}
              />
            ))}
          </ul>
          <ThemeSwitcher />
        </div>
      </nav>
    </Header>
  );
};

const isSelected = (pathname: string, href: string) => {
  const currRoute = pathname.split("/")[1];
  const hrefRoute = href.split("/")[1];
  return currRoute === hrefRoute;
};

const HomeButton: React.FC = () => {
  return (
    <Link href={"/"}>
      <div className="px-3 py-1 rounded-lg sheen-ring hover:scale-110 transition-transform text-xl bg-slate-50 dark:bg-background/50 border border-solid border-slate-400 dark:border-none">
        <p className="dark:text-body text-slate-400">~</p>
      </div>
    </Link>
  );
};