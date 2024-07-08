import { Heading, Body, Divider, Link } from "@/components/markdown";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/markdown";
import { calculateReadingTime, formatISOToDate } from "../../../lib";
import { NoteStat } from "../../../components/notes/NoteStat";
import {
  CalendarIcon,
  EyeOpenIcon,
  ClockIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { cookies } from "next/headers";
import { noteService } from "@/lib/notes/service";
import { onlyIn } from "@/lib";
import { Main } from "@/components/common";

export default async function Page({ params }: { params: any }) {
  const currentSlug = params.slug;

  const noteRes = await noteService.fetchNoteBySlug(currentSlug, cookies);
  if (noteRes.error) return notFound();
  const note = noteRes.data;

  const { metadata } = note;
  onlyIn("production", () => noteService.incrementViews(note.slug, cookies));

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
            <ViewCount text={note.views} />
          </div>
        </div>

        <Divider className="my-4" />
        <CustomMDX source={note.content} />
      </article>
    </Main>
  );
}

function ViewCount({ text }: { text: string | number | undefined }) {
  if (!text) return null;

  const views = Number(text);
  if (isNaN(views)) return null;
  if (views < 2) return null;

  return <NoteStat text={views} Icon={EyeOpenIcon} />;
}

function LikeCount({ text }: { text: string | number | undefined }) {
  if (!text) return null;

  const likes = Number(text);
  // if(isNaN(likes)) return null;
  // if(likes < 4) return null;

  return (
    <button className="border-rose-700 border bg-rose-200 py-1 px-4 rounded-full transition-colors hover:bg-rose-500 group shadow-sm hover:shadow-xl">
      <div
        className={`text-pink-700 text-sm flex flex-row items-center gap-1 group-hover:text-pink-200`}
      >
        <div className="w-4 h-4">
          <HeartIcon />
        </div>

        {text}
      </div>
    </button>
  );
}
