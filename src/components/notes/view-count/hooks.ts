import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser-client";
import {
  fetchRemoteNoteBySlug,
  isValidNoteRow,
  extractNoteFromRow,
} from "@/lib/notes";
import { useIsFirstRender } from "@/lib/hooks";
import { LIKES_VIEWS_SENTINEL } from "@/lib/notes";

type RealTimeViewCountState =
  | {
      loading: false;
      views: number;
    }
  | {
      loading: true;
      views: 0;
    }
  | {
      loading: false;
      views: typeof LIKES_VIEWS_SENTINEL;
    };

export const useRealTimeViewCount = (slug: string) => {
  const [state, setState] = useState<RealTimeViewCountState>({
    views: 0,
    loading: true,
  });
  const isFirstRender = useIsFirstRender();

  const router = useRouter();
  useEffect(() => {
    if (isFirstRender) {
      (async () => {
        console.log("useRealTimeViewCount first render");
        setState({
          views: 0,
          loading: true,
        });
        const { data, error } = await fetchRemoteNoteBySlug(slug, supabase);
        if (error) {
          console.error("Error fetching remote note", { error });
          setState({
            views: LIKES_VIEWS_SENTINEL,
            loading: false,
          });
          return;
        }
        setState({
          views: data.views ?? LIKES_VIEWS_SENTINEL,
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
          if (isValidNoteRow(payload.new)) {
            const note = extractNoteFromRow(payload.new);
            if (note.slug === slug) {
              setState({
                views: note.views ?? LIKES_VIEWS_SENTINEL,
                loading: false,
              });
            }
          } else {
            console.log("Invalid note returned from database", { payload });
            setState({
              views: LIKES_VIEWS_SENTINEL,
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
