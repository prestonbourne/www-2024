import { Database } from "@/lib/supabase/types";
import { getLocalNotes } from "..";
import { supabase, Supabase, CookieOptions } from "@/lib/supabase";
import type { Note, Result } from "@/lib/notes/types";

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

class NoteService {
  private supabase;
  public localNotes: Note[] = [];

  constructor(supabase: Supabase) {
    this.supabase = supabase;
    this.localNotes = getLocalNotes();
  }

  async getRemoteNotes(cookies: CookieOptions): Promise<Result<Note[]>> {
    const { data, error } = await this.supabase(cookies)
      .from("notes")
      .select("*");
    if (error) {
      console.error("Error fetching notes", error);

      return { data: null, error: makeSupabaseError(error) };
    }

    const validData = data.filter(this.isValidNoteRow);

    const mappedData = validData.map(this.extractNoteFromRow.bind(this));
    return { data: mappedData, error: null };
  }

  async fetchNoteBySlug(
    slug: string,
    cookies: CookieOptions
  ): Promise<Result<Note>> {
    const { data, error } = await this.supabase(cookies)
      .from("notes")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching note", error);
      return { data: null, error: makeSupabaseError(error) };
    }

    const validData = this.isValidNoteRow(data);
    if (!validData) throw new Error("Invalid note data");
    const mappedData = this.extractNoteFromRow(data);

    return { data: mappedData, error: null };
  }

  async incrementViews(slug: string, cookies: CookieOptions): Promise<void> {
    const { error } = await this.supabase(cookies).rpc("increment_note_views", {
      note_slug: slug,
    });

    if (error) {
      console.log("Error incrementing likes", error);
      throw error;
    }
  }

  async upsertNote(note: Note, cookies: CookieOptions): Promise<void> {
    const upsertData = {
      slug: note.slug,
      publish_date: note.metadata.publishedAt,
      description: note.metadata.description,
      content: note.content,
      views_count: note.views,
      likes_count: note.likes,
    };

    const { error } = await this.supabase(cookies)
      .from("notes")
      .upsert(upsertData, { onConflict: "slug" });

    if (error) {
      console.log("Error upserting note", error);
      throw error;
    }
  }

  isValidNoteRow(data: any): data is NoteRow {
    return (
      typeof data === "object" &&
      typeof data.slug === "string" &&
      typeof data.publish_date === "string" &&
      typeof data.content === "string" &&
      typeof data.views_count === "number" &&
      typeof data.likes_count === "number"
    );
  }

  extractNoteFromRow(row: NoteRow): Note {
    const title = this.localNotes.find((note) => note.slug === row.slug)
      ?.metadata.title;

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
  }

  resolveNotes(localNotes: Note[], remoteNotes: Note[]): Note[] {
    const combinedNotes: Note[] = [];

    const remoteNotesMap = new Map(
      remoteNotes.map((note) => [note.slug, note])
    );

    for (const localNote of localNotes) {
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

        combinedNotes.push(combinedNote);
      }
    }

    return combinedNotes;
  }

  async fetchNotes(cookies: CookieOptions): Promise<Result<Note[]>> {
    await Promise.all(
      this.localNotes.map(async (note) => {
        await this.upsertNote(note, cookies);
      })
    );

    const remoteNoes = await this.getRemoteNotes(cookies);
    if (remoteNoes.error) return { data: null, error: remoteNoes.error };

    const res = this.resolveNotes(this.localNotes, remoteNoes.data);
    return { data: res, error: null };
  }
}

export const noteService = new NoteService(supabase);
