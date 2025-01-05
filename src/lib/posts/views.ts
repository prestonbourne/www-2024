import { useState, useEffect } from 'react';
import { getBrowserClient } from "@/lib/supabase/browser-client";
import { registerView } from './actions';

type UseRealTimeViewsArgs = {
  initialViews: number;
  shouldInc: boolean;
  slug: string;
};

export const useRealTimeViews = ({ initialViews, shouldInc, slug }: UseRealTimeViewsArgs) => {
  // optimistic state
  const [views, setViews] = useState(initialViews + (shouldInc ? 1 : 0));
  const supabase = getBrowserClient();

  useEffect(() => {
    if (shouldInc) {
      // actually register the view
      registerView(slug).catch(console.error);
    }

    // Setup realtime subscription
    const channel = supabase
      .channel("realtime:posts.views")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          try {
            const newViews = payload.new as { audience_views?: number };
            if (
              "audience_views" in newViews &&
              typeof newViews.audience_views === "number" &&
              "slug" in newViews &&
              newViews.slug === slug
            ) {
              // Update with real value from server
              setViews(newViews.audience_views);
            }
          } catch (error) {
            console.error(error);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [slug, supabase, shouldInc]);

  return views;
};
