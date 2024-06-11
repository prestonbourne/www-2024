import { Heading, Body, Divider, Link } from "@/components/markdown";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/markdown";
import { calculateReadingTime, formatISOToDate, getNoteBySlug } from "../utils";
import { NoteStat } from "../NoteStat";
import { CalendarIcon, EyeOpenIcon, ClockIcon } from "@radix-ui/react-icons";

const withViews = (noteStat : typeof NoteStat) => {

}

export default async function Page({ params }: { params: any }) {
  const note = getNoteBySlug(params.slug);
  if (!note) {
    notFound();
  }

  const { metadata } = note;

  return (
    <article>
      <Link
        href={"/notes"}
        className="text-slate-800 hover:text-slate-600 transition-colors"
      >
        &lsaquo; Go Back
      </Link>
      <Heading level={1} className="pb-2">
        {metadata.title}
      </Heading>
      <Body className="text-slate-700 text-sm"></Body>
      <Body className="text-slate-700 text-sm">{metadata.description}</Body>
      <div className="flex justify-between my-0 py-0 items-center">
        <NoteStat
          text={formatISOToDate(metadata.publishedAt)}
          Icon={CalendarIcon}
        />
        <div className="flex gap-4 my-0 py-0 items-center">
          <NoteStat
            text={`${calculateReadingTime(note.content)} mins`}
            Icon={ClockIcon}
          />
          <NoteStat text={12} Icon={EyeOpenIcon} />
        </div>
      </div>

      <Divider />
      <CustomMDX source={note.content} />
    </article>
  );
}
