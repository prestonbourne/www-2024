import { Heading, Body, Divider, Link } from "@/components/markdown";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/markdown";
import { calculateReadingTime, formatISOToDate } from "../utils";
import { NoteStat } from "../NoteStat";
import { CalendarIcon, EyeOpenIcon, ClockIcon } from "@radix-ui/react-icons";
import { cookies } from "next/headers";
import { noteService } from "../note-service";
import { onlyInProduction } from "../utils";

export default async function Page({ params }: { params: any }) {
  const currentSlug = params.slug;

  const noteRes = await noteService.fetchNoteBySlug(currentSlug, cookies);
  if (noteRes.error) return notFound();
  const note = noteRes.data;

  const { metadata } = note;
  onlyInProduction(() => noteService.incrementViews(note.slug, cookies));
  

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
      <Body className="text-slate-700 text-sm py-2">
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
          <ViewCount text={note.views}  />
        </div>
      </div>

      <Divider className="my-4" />
      <CustomMDX source={note.content} />
    </article>
  );
}

function ViewCount({ text }: { text: string | number | undefined }) {
  if (!text) return null;

  const views = Number(text);
  if(isNaN(views)) return null;
  if(views < 4) return null;

  return <NoteStat text={views} Icon={EyeOpenIcon} />;
}