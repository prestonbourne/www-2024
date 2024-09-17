"use client";
import { useState, useEffect } from "react";

export const Clock = ({
  initialTime,
}: {
  className?: string;
  initialTime: string;
}) => {
  const [time, setTime] = useState(initialTime);
  const ONE_SECOND = 1000;

    useEffect(() => {
      const updateTime = () => {
        const newTime = new Date().toLocaleTimeString('en-US', {
          timeZone: "America/New_York",
        });
        setTime(newTime);
      };
  
      const interval = setInterval(updateTime, ONE_SECOND);
      return () => clearInterval(interval);
    }, []);



  return (
    <p className={"text-sm mb-8"}>
      EDT🗽 /{" "}
      <time dateTime={time} suppressHydrationWarning>
        {time}
      </time>
    </p>
  );
};
