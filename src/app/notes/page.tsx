import type { Metadata } from "next";
import { ContentHeading, Divider, Header, Paragraph, Main } from "@/components";
import { NoteList } from "@/components/notes/NoteList";


export const fetchCache = 'force-no-store';

const description =
  "Documentation of my learnings, thoughts and experiments. The palest ink is more persistent than the sharpest memory.";

export const metadata: Metadata = {
  title: "Notes",
  description,
};

export default function NotesHome() {
  return (
    <>
      <Header className="py-0 px-0">
        <ContentHeading title="Notes" description={description} />
        <Divider className="mt-2 mb-4" />
      </Header>
      <NoteList />
    </>
  );
}



