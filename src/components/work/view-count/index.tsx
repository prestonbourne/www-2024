"use client";
import { TextWithIcon, TextWithIconLoading } from "../../TextWithIcon";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useRealTimeViewCount } from "./hooks";
import { LIKES_VIEWS_SENTINEL } from "@/lib/work";

type RealtimeViewCountProps = {
  slug: string;
  shouldIncrement?: boolean;
};

export const ClientViewCount = ({ slug, shouldIncrement = false }: RealtimeViewCountProps) => {
  const { views, loading } = useRealTimeViewCount(slug, shouldIncrement);

  if (loading) {
    return (
      <TextWithIconLoading
        Icon={EyeClosedIcon}
        text={`Loading Views for ${slug}`}
      />
    );
  }

  if (!views || views === 0 || views <= LIKES_VIEWS_SENTINEL) {
    return null;
  }

  return <TextWithIcon text={views} Icon={EyeOpenIcon} />;
};
