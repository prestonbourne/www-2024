import { MetadataRoute } from "next";
import { notesDAO } from "@/lib/notes/dao";

export default function sitemap(): MetadataRoute.Sitemap {
  const noteEntries: MetadataRoute.Sitemap = [];
  const notes = notesDAO.getLocalNotes();

  noteEntries.push(
    ...notes.map((note) => {
      return {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/notes/${note.slug}`,
      };
    })
  );

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
