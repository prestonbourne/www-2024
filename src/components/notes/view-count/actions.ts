"use server";
import { supabase } from "@/lib/supabase/server-client";
import { fetchRemoteNoteBySlug } from "@/lib/notes";

export const getNoteAction = async (slug: string) => {
  const { data, error } = await fetchRemoteNoteBySlug(slug, supabase);
  return { data, error };
};
