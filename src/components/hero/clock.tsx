"use client";
import { useState, useEffect } from "react";
import { usePreventHydrationMismatch } from "@/lib/hooks";

export const Clock = ({ className }: { className?: string }) => {
  const [time, setTime] = useState(new Date());
  const ONE_SECOND = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, ONE_SECOND);

    return () => clearInterval(interval);
  }, []);

  const { hasHydrated } = usePreventHydrationMismatch();

  const newYorkTime = time.toLocaleTimeString(undefined, {
    timeZone: "America/New_York",
  });

  return (
    <>
      {!hasHydrated ? (
        <p className={"text-sm mb-8"}>
          EDT🗽 /{" "}
          <span
            className="animate-pulse w-12 h-3 bg-gray-200/30 rounded-sm inline-block"
            suppressHydrationWarning
          />
        </p>
      ) : (
        <p className={"text-sm mb-8"}>
          EDT🗽 /{" "}
          <time dateTime={newYorkTime} suppressHydrationWarning>
            {newYorkTime}
          </time>
        </p>
      )}
    </>
  );
};
