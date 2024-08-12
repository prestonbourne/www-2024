"use client";
import { NoteStat, NoteStatLoading } from "../NoteStat";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useRealTimeViewCount } from "./hooks";
import { LIKES_VIEWS_SENTINEL } from "@/lib/notes";

type RealtimeViewCountProps = {
  slug: string;
  shouldIncrement?: boolean;
};

export const ClientViewCount = ({ slug, shouldIncrement = false }: RealtimeViewCountProps) => {
  const { views, loading } = useRealTimeViewCount(slug, shouldIncrement);

  if (loading) {
    return (
      <NoteStatLoading
        Icon={EyeClosedIcon}
        text={`Loading Views for ${slug}`}
      />
    );
  }

  console.log({
    views,
    loading,
  });

  if (!views || views === 0 || views <= LIKES_VIEWS_SENTINEL) {
    return null;
  }

  return <NoteStat text={views} Icon={EyeOpenIcon} />;
};
