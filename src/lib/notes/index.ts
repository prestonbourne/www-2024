import path from "path";
import { Note } from "@/lib/notes/types";
import { getMDXData } from "@/lib";

const localNoteCache: Note[] = [];
export const getLocalNotes = (): Note[] => {
  if (localNoteCache.length > 0) {
    return localNoteCache;
  }
  const data = getMDXData(path.join(process.cwd(), "src/note-content"));

  data.sort((a, b) => {
    return (
      +new Date(b.metadata.publishedAt) - +new Date(a.metadata.publishedAt)
    );
  });
  localNoteCache.push(...data);
  return data;
};

export const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 220;
  const words = content.split(/\s/g).length;
  const minutes = words / wordsPerMinute;
  const readTime = Math.floor(minutes);
  return readTime;
};
