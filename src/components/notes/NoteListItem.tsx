import { Paragraph } from "@/components/typography";
import Link from "next/link";
import type { Note } from "@/lib/notes/types";
import { Suspense } from "react";

export function NoteListItem(note: Note) {
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
          className="flex flex-col justify-between justify-items-start py-2 my-2 group w-full"
        >
          <Paragraph className="transition-colors group-hover:text-primary">
            {title}
          </Paragraph>
          <div className="flex flex-row">
            {views && views !== -1 ? (
              <Suspense fallback={<p>poop</p>}>
              <Paragraph className="text-sm text-sub-text">
                {formattedDate}&nbsp;~&nbsp;{views} views
              </Paragraph>
              </Suspense>
            ) : (
              <Paragraph className="text-sm text-sub-text">
                {formattedDate}
              </Paragraph>
            )}
          </div>
        </Link>
      </li>
    );
  }