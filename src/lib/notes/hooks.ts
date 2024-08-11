import { useEffect } from "react";
import { realTimeViewsAction } from "./actions";
import { createClient } from "@/lib/supabase/browser-client";

export const useRealTimeViewCount = async (
  slug: string,
) => {
  const supabase = createClient();
  useEffect(() => {
    const channel = supabase
      .channel("realtime:notes.views")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        () => {
          console.log("Realtime view count updated");
          realTimeViewsAction(slug);
        }
      )
      .subscribe();


    return () => {
      console.log("Unsubscribing from channel");
      supabase.removeChannel(channel);
    };
  }, [supabase, slug]);
};
