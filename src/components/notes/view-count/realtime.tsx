"use client";
import { NoteStat } from "../NoteStat";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { useRealTimeViewCount } from "@/lib/notes/hooks";

type RealtimeViewCountProps = {
  slug: string;
  shouldIncrement?: boolean;
  views: number | string;
};

export const _RealTimeViewCount = ({
  slug,
  shouldIncrement = false,
  views,
}: RealtimeViewCountProps) => {
  useRealTimeViewCount(slug, shouldIncrement);

  return <NoteStat text={views} Icon={EyeOpenIcon} />;
};
