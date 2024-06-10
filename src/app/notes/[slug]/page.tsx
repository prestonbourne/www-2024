import { Heading, Body, Divider } from "@/components/markdown";
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
      <Heading level={1}>{metadata.title}</Heading>
      <Body className="text-slate-700 text-sm">{metadata.description}</Body>
      <Body className="text-slate-700 text-sm">
        {formatISOToDate(metadata.publishedAt)}{" "}0 Views{" "}{calculateReadingTime(note.content)}{" "}min read
      </Body>
      <Divider />
      <CustomMDX source={note.content} />
    </article>
  );
}
