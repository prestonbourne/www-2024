import { Clock as ClientClock } from "./clock.client";

export const Clock = ({ className }: { className?: string }) => {
  const time = new Date();
  const newYorkTime = time.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
  });

  return <ClientClock className={className} initialTime={newYorkTime} />;
};
