import { Main } from "@/components/Main";
import { Header } from "@/components/Header";
import { Body, Divider } from "@/components/markdown";
import { NoteHeading } from "./NoteHeading";
import Link from "next/link";
import { NoteStat } from "./NoteStat";
import { ArrowTopRightIcon, CalendarIcon } from "@radix-ui/react-icons";
import { noteService } from "./note-service";
import { cookies } from "next/headers";
import { BackLink } from "./BackLink";
import type { Note } from "@/types";

export default async function NotesHome() {
  let notes: Note[] = [];
  const notesRes = await noteService.fetchNotes(cookies);
  if (!notesRes.error) {
    notes = notesRes.data;
  }

  return (
    <>
      <Header className="py-0 px-0">
        <BackLink link="/" />
        <NoteHeading
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
  const { metadata, slug } = note;
  const { title, publishedAt } = metadata;
  const formattedDate = new Date(publishedAt).toLocaleDateString();
  return (
    <li className="flex flex-row justify-between items-center group hover:cursor-pointer">
      <Link href={`/notes/${slug}`} className="block my-1 group">
        <Body className="text-inherit pb-1 transition-colors decoration-dotted group-hover:underline">
          {title}
        </Body>
        <div className="text-sm flex flex-row items-center gap-1">
          <div className="w-4 h-4">
            <CalendarIcon />
          </div>
          {formattedDate}
        </div>
      </Link>
      <div className="group-hover:text-sky-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
        <ArrowTopRightIcon className="w-4 h-4" />
      </div>
    </li>
  );
}

function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <FailedToLoadNotes />;
  }

  return (
    <ol>
      {notes.map((note) => (
        <NoteItem key={note.slug} {...note} />
      ))}
    </ol>
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
