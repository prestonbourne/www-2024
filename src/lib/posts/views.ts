import { useState, useEffect } from "react";
import { getBrowserClient } from "@/lib/supabase/browser-client";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
interface UseRealTimeViewsArgs {
  shouldInc: boolean;
  slug: string;
}
interface UseRealTimeViewsReturn {
  views: number;
  state: "loading" | "idle" | "error";
}

export const useRealTimeViews = ({
  shouldInc,
  slug,
}: UseRealTimeViewsArgs): UseRealTimeViewsReturn => {
  const [views, setViews] = useState(0);
  const [state, setState] =
    useState<UseRealTimeViewsReturn["state"]>("loading");
  const supabase = getBrowserClient();

  useEffect(() => {
    getPostViews(slug, supabase).then(({ views, error }) => {
      if (error) {
        setState("error");
      } else {
        setViews(views);
        setState("idle");
      }
    });
    if (shouldInc) {
      registerView(slug, supabase).catch(console.error);
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

  return { views, state };
};

const registerView = async (
  slug: string,
  supabase: SupabaseClient
): Promise<void> => {
  const { data, error } = await supabase.rpc("increment_post_views_by_slug", {
    post_slug: slug,
  });

  if (error) {
    console.error(error);
  }
};

const getPostViews = async (
  slug: string,
  supabase: SupabaseClient
): Promise<{ views: number; error: PostgrestError | null }> => {
  const { data, error } = await supabase
    .from("posts")
    .select("audience_views")
    .eq("slug", slug)
    .single();
  if (error) {
    console.error(error);
  }
  return { views: data?.audience_views ?? 0, error };
};
