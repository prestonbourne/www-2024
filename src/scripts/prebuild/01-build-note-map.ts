import fs from "fs";
import path from "path";
import { Note } from "@/lib/notes/types";
import { getMDXData } from "../mdx-utils";

export const getLocalNotes = (): Note[] => {
  const data = getMDXData(path.join(process.cwd(), "src/note-content"));

  data.sort((a, b) => {
    return (
      +new Date(b.metadata.publishedAt) - +new Date(a.metadata.publishedAt)
    );
  });
  return data;
};

export default function script() {
  type NoteMap = Record<string, Note>;
  const buildNotesMap = (notes: Note[]) => {
    const notesMap: NoteMap = {};
    notes.forEach((note) => {
      notesMap[note.slug] = note;
    });

    return notesMap;
  };

  const notes = getLocalNotes();

  const notesMap = buildNotesMap(notes);
  const notesMapPath = path.join(process.cwd(), "src/lib/notes/notesMap.json");

  try {
    fs.writeFileSync(notesMapPath, JSON.stringify(notesMap, null, 2));
    console.log("Notes map written to file successfully");
  } catch (e) {
    console.error("Failed to write notes map to file:", e);
    throw e;
  }
}
