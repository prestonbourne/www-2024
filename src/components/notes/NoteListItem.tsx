import { Paragraph } from "@/components/typography";
import Link from "next/link";
import type { Note } from "@/lib/notes/types";
import { NoteStat } from "./NoteStat";
import { CalendarIcon } from "@radix-ui/react-icons";
import { ClientViewCount } from "./view-count";

export function NoteListItem(note: Note) {
  const { metadata, slug } = note;
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
        <div className="flex flex-row gap-4">
          <NoteStat Icon={CalendarIcon} text={formattedDate} />

            <ClientViewCount slug={slug} />
        </div>
      </Link>
    </li>
  );
}
