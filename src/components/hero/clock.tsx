"use client";
import { useState, useEffect } from "react";

export const Clock = () => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
    })
  );
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
    <p className="text-foreground antialiased">
      <time dateTime={time} suppressHydrationWarning>
        {time}
      </time>
      {" 🗽"}
    </p>
  );
};
