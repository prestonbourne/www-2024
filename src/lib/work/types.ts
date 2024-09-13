import { Database } from "../supabase/types.gen";
import { MDXEntity, MDXEntityMetadata } from "../types";

export type WorkMetadata = MDXEntityMetadata;

export type WorkWithRoute = MDXEntity & {
  type: "work_route";
  likes?: number;
  views?: number;
};

export type WorkExternal = {
  type: "work_external";
  url: string;
  metadata: WorkMetadata;
};

export type WorkStatic = {
  type: "work_static";
  metadata: WorkMetadata;
};

export type Work = WorkWithRoute | WorkExternal | WorkStatic;

export type Result<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: Error;
    };

export type WorkRow = Database["public"]["Tables"]["work"]["Row"];
