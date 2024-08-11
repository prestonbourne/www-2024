import { getLocalNotes } from "@/lib/notes";
import { NoteListItem } from "./NoteListItem";
import { Main } from "@/components";

export async function NoteList() {
  const notes = getLocalNotes();

  return (
    <Main>
      <ol>
        {notes.map((note) => (
          <NoteListItem key={note.slug} {...note} />
        ))}
      </ol>
    </Main>
  );
}
