import { WorkMetadata, WorkWithRoute, WorkExternal } from "./types";

export const isValidWorkMetadata = (
  metadata: any
): metadata is WorkMetadata => {
  return (
    typeof metadata.title === "string" &&
    typeof metadata.publishedAt === "string" &&
    typeof metadata.description === "string" &&
    (metadata.imageURL === undefined ||
      typeof metadata.imageURL === "string") &&
    (metadata.tags === undefined || Array.isArray(metadata.tags))
  );
};

export const isValidWorkWithRoute = (jsonData: any): jsonData is WorkWithRoute => {
  return (
    jsonData.type === "work_route" &&
    isValidWorkMetadata(jsonData.metadata) &&
    (jsonData.likes === undefined || typeof jsonData.likes === "number") &&
    (jsonData.views === undefined || typeof jsonData.views === "number")
  );
};

export const isValidWorkExternal = (data: any): data is WorkExternal => {
  return (
    typeof data === "object" &&
    typeof data.url === "string" &&
    data.type === "work_external" &&
    typeof data.metadata === "object" &&
    isValidWorkMetadata(data.metadata)
  );
};
