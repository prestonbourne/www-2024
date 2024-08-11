import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { incrementViewsBySlug } from "./index";

export const useRealTimeViewCount = async (
  slug: string,
  shouldIncrement = false
) => {
  const router = useRouter();
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
          router.refresh();
        }
      )
      .subscribe();

    if (shouldIncrement && document) {
      incrementViewsBySlug(slug);
    }

    return () => {
      console.log("Unsubscribing from channel");
      supabase.removeChannel(channel);
    };
  }, [router]);
};
