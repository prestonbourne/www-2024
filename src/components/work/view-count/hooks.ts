import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser-client";
// import { fetchRemoteWorkBySlug } from "@/lib/work";
import { useIsFirstRender } from "@/lib/hooks";
// import { incrementWorkViewsAction } from "./actions";

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
  const inProd = process.env.NODE_ENV === "production";
  const router = useRouter();

  const doAction = async (action: () => Promise<{ data: any; error: any }>) => {
    setState((prevState) => ({ ...prevState, loading: true }));

    const { data, error } = await action();

    if (error) {
      console.error("Error fetching data", { error });
      setState((prevState) => ({ ...prevState, loading: false }));
      return;
    }

    //one function returns a number literal, the other returns an object with views as a key
    const objResponse = typeof data === 'object' && 'views' in data;
    const numberResponse = typeof data === "number";

    if (!data) {
      console.error("No data returned from action");
      setState((prevState) => ({ ...prevState, loading: false }));
      return;
    } else if (numberResponse) {
      setState((prevState) => ({ ...prevState, views: data, loading: false }));
    } else if (objResponse) {
      setState((prevState) => ({
        ...prevState,
        views: data.views,
        loading: false,
      }));
    }

    console.log("Unexpected data returned from action", { data });

    setState((prevState) => ({ ...prevState, loading: false }));
  };

  useEffect(() => {
    // if (isFirstRender && inProd) {
    //   if (shouldIncrement) {
    //     doAction(() => incrementWorkViewsAction(slug));
    //   }
    // } else {
    //   doAction(() => fetchRemoteWorkBySlug(slug, supabase));
    // }

    // real time
    const channel = supabase
      .channel("realtime:works.views")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "works",
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
  }, [slug, router, isFirstRender, inProd, shouldIncrement]);

  return state;
};
