import "server-only";
import { Database } from "@/lib/supabase/types";
import { supabase, Supabase, CookieOptions } from "@/lib/supabase";
import type { Note, Result } from "@/lib/notes/types";
import notesMap from "./notesMap.json" assert { type: "json" };

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
/* 
the DAO class for notes, which handles fetching, updating, and combining local and remote notes
the distinction between local and remote notes is that local notes are the notes that are statically generated at build time, 
while remote notes are the notes that are fetched from the database at runtime we prefer the local notes over the remote notes 
because they are more up-to-date and we don't want to overwrite them with the remote notes
the main reason we fetch the remote notes is to get the views and likes count for each note which are not available at build time
*/
class NotesDAO {
  private supabase;
  public localNotesMap: NoteMap;
  public remoteNotesCache: NoteMap;
  private localNotes: Note[] = [];
  private remoteNotes: Note[] = [];

  constructor(supabase: Supabase, notesMap: Record<string, Note>) {
    this.supabase = supabase;
    this.localNotesMap = new Map(Object.entries(notesMap));
    this.localNotes = Object.values(notesMap);
    this.remoteNotesCache = new Map();
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
    this.remoteNotesCache = new Map(
      mappedData.map((note) => [note.slug, note])
    );
    return { data: mappedData, error: null };
  }

  async fetchNoteBySlug(
    slug: string,
    cookies: CookieOptions
  ): Promise<Result<Note>> {
    if (this.remoteNotesCache.has(slug)) {
      return { data: this.remoteNotesCache.get(slug)!, error: null };
    }

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
    this.remoteNotesCache.set(slug, mappedData);

    return { data: mappedData, error: null };
  }

  async incrementViews(slug: string, cookies: CookieOptions): Promise<number> {
    const { error, data } = await this.supabase(cookies).rpc(
      "increment_note_views",
      {
        note_slug: slug,
      }
    );

    if (error) {
      console.log("Error incrementing views", error);
      throw error;
    }
    if (this.remoteNotesCache.has(slug)) {
      this.remoteNotesCache.get(slug)!.views = data;
    }
    
    return data;
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

  resolveNotes(): Note[] {
    const combinedNotes: Note[] = [];

    const remoteNotesMap = new Map(
      this.remoteNotes.map((note) => [note.slug, note])
    );

    for (const localNote of this.localNotes) {
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
        this.localNotesMap.set(localNote.slug, combinedNote);
        combinedNotes.push(combinedNote);
      }
    }
    return combinedNotes;
  }

  async fetchNotes(cookies: CookieOptions): Promise<Result<Note[]>> {
    const remoteNotes = await this.getRemoteNotes(cookies);
    if (remoteNotes.error) return { data: null, error: remoteNotes.error };

    this.remoteNotes = remoteNotes.data;
    const data = this.resolveNotes();
    return { data, error: null };
  }

  getLocalNotes(): Note[] {
    return this.localNotes;
  }
}

export const notesDAO = new NotesDAO(supabase, notesMap);
