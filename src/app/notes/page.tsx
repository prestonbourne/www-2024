import { Main } from "@/components/Main";
import { Header } from "@/components/Header";
import { Body, Divider, Heading } from "@/components/markdown";
import type { Note } from "@/app/notes/utils";
import { NoteHeading } from "./NoteHeading";
import Link from "next/link";
import { getNotes } from "@/app/notes/utils";

export default async function NotesHome() {
    return (
        <>
            <Header>
                <Link
                    href={"/"}
                    className="text-slate-800 hover:text-slate-600 transition-colors"
                >
                &lsaquo; Go Back
                </Link>
                <NoteHeading
                title="Notes"
                description="Documentation of my learnings, thoughts and experiments. The
                palest ink is more persistent than the sharpest memory."
                />
                <Divider />
            </Header>
            <Main>
                <NoteList notes={getNotes()} />
            </Main>
        </>
    );
}

function Note(note: Note) {
    const { metadata, slug } = note;
    const { title, publishedAt } = metadata;
    return (
        <li>
            <Link
                href={`/notes/${slug}`}
                className="block my-1 hover:text-slate-600 transition-all"
            >
                <Body>
                    {title} <br /> {new Date(publishedAt).toLocaleDateString()}
                </Body>
            </Link>
        </li>
    );
}

function NoteList({ notes }: { notes: Note[] }) {
    return (
        <ol>
            {notes.map(note => (
                <Note key={note.slug} {...note} />
            ))}
        </ol>
    );
}
