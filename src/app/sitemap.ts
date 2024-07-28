import { MetadataRoute } from "next";
import { noteService } from "@/lib/notes/service";
import { cookies } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const noteEntries: MetadataRoute.Sitemap = [];
  const notes = await noteService.fetchNotes(cookies);
  if (notes.data) {
    noteEntries.push(
      ...notes.data.map((note) => {
        return {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/notes/${note.slug}`,
        };
      })
    );
  }

  return [
    {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/notes`,
    },
    ...noteEntries,
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/sketches`,
    },
  ];
}
