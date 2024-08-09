"use server"
import { notesDAO } from "@/lib/notes/dao";

export const incrementViewsAction = async (slug: string, cookies: any) => {
    console.log("server action: incrementViews");
    const res = await notesDAO.incrementViews(slug, cookies);
    return res;
}