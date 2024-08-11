/* 
handles fetching, updating, and combining local and remote notes
the distinction between local and remote notes is that local notes are the notes that are statically generated at build time, 
while remote notes are the notes that are fetched from the database at runtime we prefer the local notes over the remote notes 
because they are more up-to-date and we don't want to overwrite them with the remote notes
the main reason we fetch the remote notes is to get the views and likes count for each note which are not available at build time
*/
import { Database } from "@/lib/supabase/types";
import type { Note, Result } from "@/lib/notes/types";
import notesMap from "./notesMap.json" assert { type: "json" };
import { SupabaseClient } from "@supabase/supabase-js";

// Schema for the notes table
type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
export const LIKES_VIEWS_SENTINEL = -1;

type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};

const makeSupabaseError = (pgErr: PostgrestError) => {
  const error: Error = {
    name: "SupabaseError",
    ...pgErr,
  };
  return error;
};

type NoteMap = Map<string, Note>;
const localNotesMap: NoteMap = new Map(Object.entries(notesMap));
const localNotesArr = Object.values(notesMap);

export const getLocalNotes = (): Note[] => {
  return localNotesArr;
};

export const getLocalNoteBySlug = (slug: string): Note | undefined => {
  return localNotesMap.get(slug);
};

export const fetchRemoteNoteBySlug = async (
  slug: string,
  supabase: SupabaseClient
): Promise<Result<Note>> => {
  console.log("`fetchRemoteNoteBySlug` called");
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching note", error);
    return { data: null, error: makeSupabaseError(error) };
  }

  const validData = isValidNoteRow(data);
  if (!validData) {
    return {
      data: null,
      error: new Error("Invalid note returned from database"),
    };
  }
  const mappedData = extractNoteFromRow(data);

  return { data: mappedData, error: null };
};

async function upsertNote(note: Note, supabase: SupabaseClient): Promise<void> {
  const upsertData = {
    slug: note.slug,
    publish_date: note.metadata.publishedAt,
    description: note.metadata.description,
    content: note.content,
    views_count: note.views,
    likes_count: note.likes,
  };

  const { error } = await supabase
    .from("notes")
    .upsert(upsertData, { onConflict: "slug" });

  if (error) {
    console.error("Error upserting note", error);
    throw error;
  }
}

export const incrementViewsBySlug = async (
  slug: string,
  supabase: SupabaseClient
): Promise<Result<number>> => {
  console.log("`incrementViewsBySlug` called");
  const { error, data } = await supabase.rpc("increment_note_views", {
    note_slug: slug,
  });

  if (error) {
    console.error("Error incrementing note views", error);
    return { data: null, error: makeSupabaseError(error) };
  }
  return { data, error: null };
};

export const isValidNoteRow = (data: any): data is NoteRow => {
  return (
    typeof data === "object" &&
    typeof data.slug === "string" &&
    typeof data.publish_date === "string" &&
    typeof data.content === "string" &&
    typeof data.views_count === "number" &&
    typeof data.likes_count === "number"
  );
};

export const extractNoteFromRow = (row: NoteRow): Note => {
  const title = localNotesArr.find((note) => note.slug === row.slug)?.metadata
    .title;

  return {
    slug: row.slug,
    metadata: {
      title: title || "",
      publishedAt: row.publish_date,
      description: row.description || "",
    },
    content: row.content,
    views: row.views_count || LIKES_VIEWS_SENTINEL,
    likes: row.likes_count || LIKES_VIEWS_SENTINEL,
  };
};

const resolveNotes = (remoteNotes: Note[]): Note[] => {
  const combinedNotes: Note[] = [];

  const remoteNotesMap = new Map(remoteNotes.map((note) => [note.slug, note]));

  for (const localNote of localNotesArr) {
    const remoteNote = remoteNotesMap.get(localNote.slug);

    if (!remoteNote) {
      combinedNotes.push({
        ...localNote,
        likes: LIKES_VIEWS_SENTINEL,
        views: LIKES_VIEWS_SENTINEL,
      });
    }

    if (remoteNote) {
      const combinedNote: Note = {
        slug: localNote.slug,
        metadata: {
          title: localNote.metadata.title,
          description: localNote.metadata.description,
          publishedAt: remoteNote.metadata.publishedAt,
        },
        content: localNote.content,
        views: remoteNote.views,
        likes: remoteNote.likes,
      };
      localNotesMap.set(localNote.slug, combinedNote);
      combinedNotes.push(combinedNote);
    }
  }
  return combinedNotes;
};

const _fetchRemoteNotes = async (
  supabase: SupabaseClient
): Promise<Result<Note[]>> => {
  const { data, error } = await supabase.from("notes").select("*");
  if (error) {
    console.error("Error fetching notes", error);
    return { data: null, error: makeSupabaseError(error) };
  }

  const validData = data.filter(isValidNoteRow);
  const mappedData = validData.map(extractNoteFromRow);
  return { data: mappedData, error: null };
};

export const fetchRemoteNotes = async (
  supabase: SupabaseClient
): Promise<Result<Note[]>> => {
  const remoteNotes = await _fetchRemoteNotes(supabase);
  if (remoteNotes.error) return { data: null, error: remoteNotes.error };

  const data = resolveNotes(remoteNotes.data);
  return { data, error: null };
};

export const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 220;
  const words = content.split(/\s/g).length;
  const minutes = words / wordsPerMinute;
  const readTime = Math.floor(minutes);
  return readTime;
};
