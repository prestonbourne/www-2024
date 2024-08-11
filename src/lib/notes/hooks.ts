import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export const useRealTimeViewCount = async (path: string) => {
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);
};
