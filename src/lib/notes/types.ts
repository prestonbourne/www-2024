import { Database } from "../supabase/types";

export type NoteMetadata = {
  title: string;
  publishedAt: string;
  description: string;
  image?: string;
  featured?: string;
  tags?: string;
};

export type Note = {
  slug: string;
  metadata: NoteMetadata;
  content: string;
  likes?: number;
  views?: number;
};

export type Result<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: Error;
    };

export type NoteRow = Database["public"]["Tables"]["notes"]["Row"];