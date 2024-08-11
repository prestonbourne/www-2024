import { fetchRemoteNoteBySlug, incrementViewsBySlug } from "@/lib/notes";
import { createClient } from "@/lib/supabase/server-client";
import { _RealTimeViewCount } from "./realtime";

type ViewCountProps = {
  slug: string;
  shouldIncrement?: boolean;
};

export const _ServerViewCount = async ({
  slug,
  shouldIncrement = false,
}: ViewCountProps) => {
  const supabase = createClient();
  const inProd = process.env.NODE_ENV === "production";

  
  if (shouldIncrement && inProd) {
    const { error, data: views } = await incrementViewsBySlug(slug, supabase);
    if (error || !views) {
      console.error("Error incrementing note views", error);
      return null;
    }
    return <_RealTimeViewCount slug={slug} views={views} />;
  }

  const { data, error } = await fetchRemoteNoteBySlug(slug, supabase);

  if (error || !data || !data.views) {
    console.error("Error fetching note", error);
    return null;
  }

  return (
    <_RealTimeViewCount
      slug={slug}
      views={data.views}
    />
  );
};
