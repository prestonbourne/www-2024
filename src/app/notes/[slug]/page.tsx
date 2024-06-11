import { Heading, Body, Divider, Link } from "@/components/markdown";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/markdown";
import { calculateReadingTime, formatISOToDate, getNoteBySlug } from "../utils";

export default async function Blog({ params }: { params: any }) {
  const note = getNoteBySlug(params.slug);
  if (!note) {
    notFound();
  }

  const { metadata } = note;

  return (
    <article>
      <Link
        href={"/"}
        className="text-slate-800 hover:text-slate-600 transition-colors"
      >
        &lsaquo; Go Back
      </Link>
      <Heading level={1} className="pb-2">{metadata.title}</Heading>
      <Body className="text-slate-700 text-sm">
        {formatISOToDate(metadata.publishedAt)}
      </Body>
      <Body className="text-slate-700 text-sm">{metadata.description}</Body>
      <Body className="text-slate-700 text-sm">
        {calculateReadingTime(note.content)} min read
      </Body>
      <Divider />
      <CustomMDX source={note.content} />
    </article>
  );
}
