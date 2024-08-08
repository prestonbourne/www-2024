import { NoteListItem } from "./NoteListItem";
import { Main } from "@/components";
import { Paragraph } from "@/components/typography";
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

function FailedToLoadNotes() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Paragraph className="text-slate-800 text-lg">
        Sorry about that, something went wrong when trying to fetch my notes
      </Paragraph>
    </div>
  );
}
