import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { NoteMDXRenderer } from "@/components/markdown";
import { formatISOToDate } from "@/lib/index";
import {
  calculateReadingTime,
  getLocalNoteBySlug,
  getLocalNotes,
} from "@/lib/notes";
import { NextPageProps } from "@/lib/types";
import { NoteStat, NoteStatLoading } from "@/components/notes/NoteStat";
import { CalendarIcon, ClockIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { Main } from "@/components/Main";
import { Divider } from "@/components/Divider";
import { Heading } from "@/components/typography/Heading";
import { Paragraph as Body } from "@/components/typography/Paragraph";
import { ViewCount } from "@/components/notes/view-count";


export const fetchCache = 'force-no-store';

export function generateStaticParams() {
  const notes = getLocalNotes();

  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({ params }: NextPageProps) {
  const currentSlug = params.slug;
  const note = getLocalNoteBySlug(currentSlug);

  if (!note) return notFound();
  const { title, description } = note.metadata;

  return {
    title,
    description,
  };
}

export default async function Page({ params }: NextPageProps) {
  const currentSlug = params.slug;

  const note = getLocalNoteBySlug(currentSlug);
  if (!note) return notFound();
  const { metadata } = note;

  return (
    <Main>
      <article>
        <Heading level={1} className="pb-2">
          {metadata.title}
        </Heading>
        <Body className="text-sm py-2 text-sub-text">
          {metadata.description}
        </Body>
        <div className="flex justify-between my-2 py-0 items-center">
          <NoteStat
            text={formatISOToDate(metadata.publishedAt)}
            Icon={CalendarIcon}
          />
          <div className="flex gap-4 my-0 py-0 items-center">
            <NoteStat
              text={`${calculateReadingTime(note.content)} mins`}
              Icon={ClockIcon}
            />
            <Suspense
              fallback={
                <NoteStatLoading
                  Icon={EyeClosedIcon}
                  text={"Loading View Count"}
                />
              }
            >
              <ViewCount slug={note.slug} shouldIncrement />
            </Suspense>
          </div>
        </div>
        <Divider className="my-4" />
        <NoteMDXRenderer source={note.content} />
      </article>
    </Main>
  );
}
