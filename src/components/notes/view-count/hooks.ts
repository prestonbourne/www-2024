import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser-client";
import {
  fetchRemoteNoteBySlug,
} from "@/lib/notes";
import { useIsFirstRender } from "@/lib/hooks";
import { LIKES_VIEWS_SENTINEL } from "@/lib/notes";
import { incrementNoteViewsAction } from "./actions";

type RealTimeViewCountState = {
  views: number;
  loading: boolean;
};

export const useRealTimeViewCount = (slug: string, shouldIncrement = false) => {
  const [state, setState] = useState<RealTimeViewCountState>({
    views: 0,
    loading: true,
  });
  const isFirstRender = useIsFirstRender();

  const router = useRouter();
  useEffect(() => {
    if (isFirstRender && shouldIncrement) {
      (async () => {
        console.log("useRealTimeViewCount first render");
        setState({
          views: LIKES_VIEWS_SENTINEL,
          loading: true,
        });
        const { data, error } = await incrementNoteViewsAction(slug);
        if (error) {
          console.error("Error fetching remote note", { error });
          setState({
            views: LIKES_VIEWS_SENTINEL,
            loading: false,
          });
          return;
        }
        if (!data) {
          console.error("No data returned from incrementNoteViewsAction");
          setState({
            views: LIKES_VIEWS_SENTINEL,
            loading: false,
          });
          return;
        }

        setState({
          views: data,
          loading: false,
        });
      })();
    } else if (isFirstRender && !shouldIncrement) {
      (async () => {
        const { data, error } = await fetchRemoteNoteBySlug(slug, supabase);
        if (error) {
          console.error("Error fetching remote note", { error });
          setState({
            views: LIKES_VIEWS_SENTINEL,
            loading: false,
          });
          return;
        }
        if (!data) {
          console.error("No data returned from fetchRemoteNoteBySlug");
          setState({
            views: LIKES_VIEWS_SENTINEL,
            loading: false,
          });
          return;
        }
        if (!data.views) {
          setState({
            views: LIKES_VIEWS_SENTINEL,
            loading: false,
          });
          return;
        }
        setState({
          views: data.views,
          loading: false,
        });
      })();
    }

    // real time
    const channel = supabase
      .channel("realtime:notes.views")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        (payload) => {
          const hasViewCount =
            "views_count" in payload.new &&
            typeof payload.new.views_count === "number";
          const sameSlug = "slug" in payload.new && payload.new.slug === slug;
          if (hasViewCount && sameSlug) {
            setState({
              // @ts-ignore
              views: payload.new.views_count,
              loading: false,
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, slug, router]);

  return state;
};
