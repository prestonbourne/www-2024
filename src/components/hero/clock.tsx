"use client";
import { useState, useEffect } from "react";

export const Clock = () => {
  const [time, setTime] = useState<string>();
  const ONE_SECOND = 1000;

  useEffect(() => {
    const updateTime = () => {
      const newTime = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
      });
      setTime(newTime);
    };

    const interval = setInterval(updateTime, ONE_SECOND);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm mb-8">
      EDT 🗽 /{" "}
      {!!time ? (
        <time dateTime={time} suppressHydrationWarning>
          {time}
        </time>
      ) : (
        <span className="ml-1 rounded-sm inline-block w-16 h-3 animate-pulse bg-slate-500/40"></span>
      )}
    </p>
  );
};
