import { NoteListItem } from "./NoteListItem";
import { Main } from "@/components";
import { notesDAO } from "@/lib/notes/dao";

export async function NoteList() {
  const notes = notesDAO.getLocalNotes();

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
