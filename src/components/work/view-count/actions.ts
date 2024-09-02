"use server";
import { supabase } from "@/lib/supabase/server-client";
import { incrementViewsBySlug, fetchRemoteWorkBySlug } from "@/lib/work";

export const incrementWorkViewsAction = async (slug: string) => {
  const { data, error } = await incrementViewsBySlug(slug, supabase);
  return { data, error };
};

export const getWorkBySlugAction = async (slug: string) => {
    const { data, error } = await fetchRemoteWorkBySlug(slug, supabase);
    return { data, error };
}