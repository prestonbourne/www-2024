'use client'
import { useRealTimeViews } from "@/lib/posts/views";
import { TextWithIcon, TextWithIconLoading } from "@/components/text-with-icon";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

type ViewCounterProps = {
  slug: string;
  shouldInc?: boolean;
};

export function ViewCounter({ slug, shouldInc = false }: ViewCounterProps) {
  const { views, state } = useRealTimeViews({ shouldInc, slug });
  if(state === "loading") return <TextWithIconLoading Icon={EyeClosedIcon} />;
  if(state === "error") return null;
  
  return (
    <TextWithIcon 
      text={`${views} views`} 
      Icon={EyeOpenIcon}
    />
  );
}