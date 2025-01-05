'use client'

import { useRealTimeViews } from "@/lib/posts/views";
import { TextWithIcon } from "@/components/text-with-icon";
import { EyeOpenIcon } from "@radix-ui/react-icons";

type ViewCounterProps = {
  slug: string;
  initialViews: number;
  shouldInc?: boolean;
};

export function ViewCounter({ slug, initialViews, shouldInc = false }: ViewCounterProps) {
  const views = useRealTimeViews({ initialViews, shouldInc, slug });
  if(views === 0) return null;
  
  return (
    <TextWithIcon 
      text={`${views} views`} 
      Icon={EyeOpenIcon}
    />
  );
}