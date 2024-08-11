import fs from "fs";
import path from "path";
import { NoteMetadata, Note } from "@/lib/notes/types";



export const formatISOToDate = (ISO: string) => {
  return new Date(ISO).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const onlyIn = (env: typeof process.env.NODE_ENV, fn: Function) => {
  if (process.env.NODE_ENV === env) {
    return fn();
  }
  return null;
};
