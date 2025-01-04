'use client'

import { useRealTimeViews } from "@/lib/posts/views";
import { TextWithIcon } from "@/components/text-with-icon";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";

type ViewCounterProps = {
  slug: string;
  initialViews: number;
  shouldInc?: boolean;
};

function ViewCounter({ slug, initialViews, shouldInc = false }: ViewCounterProps) {
  const views = useRealTimeViews({ initialViews, shouldInc, slug });
  
  return (
    <TextWithIcon 
      text={`${views} views`} 
      Icon={EyeOpenIcon}
    />
  );
}

// Add a loading fallback to prevent layout shift
export function ViewCounterWithSuspense(props: ViewCounterProps) {
  return (
    <Suspense fallback={<TextWithIcon text={`${props.initialViews} views`} Icon={EyeOpenIcon} />}>
      <ViewCounter {...props} />
    </Suspense>
  );
} 