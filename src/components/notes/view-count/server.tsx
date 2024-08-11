import { incrementViewsBySlug, fetchRemoteNoteBySlug } from "@/lib/notes";
import { _RealTimeViewCount } from "./realtime";

type ViewCountProps = {
  slug: string;
  shouldIncrement?: boolean;
};

export const _ServerViewCount = async ({
  slug,
  shouldIncrement = false,
}: ViewCountProps) => {
  const { data, error } = await fetchRemoteNoteBySlug(slug);

  if (error || !data || !data.views) {
    console.error("Error fetching note", error);
    return null;
  }

  return (
    <_RealTimeViewCount
      slug={slug}
      shouldIncrement={shouldIncrement}
      views={data.views}
    />
  );
};
