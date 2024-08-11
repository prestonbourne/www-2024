"use server"
import { revalidatePath } from "next/cache";


export const realTimeViewsAction = async (slug: string) => {
    revalidatePath(`/notes${slug}`);
  };