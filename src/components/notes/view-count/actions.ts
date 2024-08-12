"use server";
import { supabase } from "@/lib/supabase/server-client";
import { incrementViewsBySlug, fetchRemoteNoteBySlug } from "@/lib/notes";

export const incrementNoteViewsAction = async (slug: string) => {
  const { data, error } = await incrementViewsBySlug(slug, supabase);
  return { data, error };
};

export const getNoteBySlugAction = async (slug: string) => {
    const { data, error } = await fetchRemoteNoteBySlug(slug, supabase);
    return { data, error };
}