import { NoteStat } from "./NoteStat";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { notesDAO } from "@/lib/notes/dao";
import { cookies } from "next/headers";

type ViewCountProps = {
  slug: string;
  shouldIncrement?: boolean;
};

export async function ViewCount({
  slug,
  shouldIncrement = false,
}: ViewCountProps) {
  console.log("`ViewCount` render", { props: { slug, shouldIncrement } });
  let views = 0;
  const inProd = process.env.NODE_ENV === "production";


  if (shouldIncrement) {
    views = await notesDAO.incrementViews(slug, cookies);
    console.log("`ViewCount.incrementViews`", {
      views,
      slug,
    });
    return <NoteStat text={views} Icon={EyeOpenIcon} />;
  }

  const { data, error } = await notesDAO.fetchNoteBySlug(slug, cookies);

  if (error || !data || !data.views) {
    return null;
  }
  views = data.views;
  return <NoteStat text={views} Icon={EyeOpenIcon} />;
}
