import { Header, Main } from "@/components/common";
import { Body, Divider } from "@/components/markdown";
import { ContentHeading } from "@/components/common";
import Link from "next/link";
import { noteService } from "@/lib/notes/service";
import { cookies } from "next/headers";
import type { Note } from "@/lib/notes/types";

export default async function NotesHome() {
  let notes: Note[] = [];
  const notesRes = await noteService.fetchNotes(cookies);
  if (!notesRes.error) {
    notes = notesRes.data;
  }

  return (
    <>
      <Header className="py-0 px-0">
        <ContentHeading
          title="Notes"
          description="Documentation of my learnings, thoughts and experiments. The
                palest ink is more persistent than the sharpest memory."
        />
        <Divider className="mt-2 mb-4" />
      </Header>
      <NoteList notes={notes} />
    </>
  );
}

function NoteItem(note: Note) {
  const { metadata, slug, views } = note;
  const { title, publishedAt } = metadata;
  const date = new Date(publishedAt);
  const formattedDate = `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;

  return (
    <li>
      <Link
        href={`/notes/${slug}`}
        className="flex flex-col justify-between py-2 my-2 group w-full"
      >
        <Body className="transition-colors group-hover:text-primary">
          {title}
        </Body>
        <div className="flex flex-row">
          {views ? (
            <Body className="text-sm text-sub-text">
              {formattedDate}&nbsp;~&nbsp;{views} views
            </Body>
          ) : (
            <Body className="text-sm text-sub-text">{formattedDate}</Body>
          )}
        </div>
      </Link>
    </li>
  );
}

function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <FailedToLoadNotes />;
  }

  return (
    <Main>
      <ol>
        {notes.map((note) => (
          <NoteItem key={note.slug} {...note} />
        ))}
      </ol>
    </Main>
  );
}

function FailedToLoadNotes() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Body className="text-slate-800 text-lg">
        Sorry about that, something went wrong when trying to fetch my notes
      </Body>
    </div>
  );
}
