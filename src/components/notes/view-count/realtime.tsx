"use client";
import { NoteStat } from "../NoteStat";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { useRealTimeViewCount } from "@/lib/notes/hooks";

type RealtimeViewCountProps = {
  slug: string;
  views: number | string;
};

export const _RealTimeViewCount = ({
  slug,
  views,
}: RealtimeViewCountProps) => {
  useRealTimeViewCount(slug);

  return <NoteStat text={views} Icon={EyeOpenIcon} />;
};
