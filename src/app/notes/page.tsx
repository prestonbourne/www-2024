import Link from "next/link";
import type { Metadata } from "next";
import { noteService } from "@/lib/notes/service";
import { cookies } from "next/headers";
import type { Note } from "@/lib/notes/types";
import { ContentHeading, Divider, Header, Paragraph, Main } from "@/components";


const description = "Documentation of my learnings, thoughts and experiments. The palest ink is more persistent than the sharpest memory.";

export const metadata: Metadata = {
  title: "Notes",
  description,
};

const TWO_HOURS = 60 * 60 * 2;
export const revalidate = TWO_HOURS;

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
          description={description}
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
        <Paragraph className="transition-colors group-hover:text-primary">
          {title}
        </Paragraph>
        <div className="flex flex-row">
          {views ? (
            <Paragraph className="text-sm text-sub-text">
              {formattedDate}&nbsp;~&nbsp;{views} views
            </Paragraph>
          ) : (
            <Paragraph className="text-sm text-sub-text">{formattedDate}</Paragraph>
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
      <Paragraph className="text-slate-800 text-lg">
        Sorry about that, something went wrong when trying to fetch my notes
      </Paragraph>
    </div>
  );
}
