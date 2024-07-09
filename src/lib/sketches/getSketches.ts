import type { Sketch, SketchMetaData } from "./types";
import { SketchLoading } from "@/components/sketches/SketchLoading";
import dynamic from "next/dynamic";

type MetadataModule = {
  default: SketchMetaData;
};

export const getSketches = async (): Promise<Sketch[]> => {
  /*
    getting fs is not a mdoule errors for some reason. I think it's because it's a node module and we have a "use client" 
    in one of the providers that wraps the whole app. I'm not sure how to fix this, so I'm just going to hardcode the sketch IDs for now
    this is very strange because we are using fs in other parts of the app and it works fine. (e.g. in the notes service)
    path also works and is a node module, so I'm not sure why fs is throwing an error
  
    every folder in src/sketches is a sketch, the folder name is the sketch ID 
    ideally we enforce that each folder matches this schema and the names are all unique
    but thats overkill for now
  */

  // const getSketchIDs = async () => {
  //   const sketchesDir = path.join(__dirname, "../../sketches");
  //   const sketchFolders = await fs.promises.readdir(sketchesDir, { withFileTypes: true });
  //   const sketchIDs = sketchFolders
  //     .filter((dirent) => dirent.isDirectory())
  //     .map((dirent) => dirent.name);
  //   return sketchIDs;
  // };

  const sketchIDs = ["first-water"];

  const sketches = await Promise.all(
    sketchIDs.map(async (id) => {
      const metadata = await import(`../../sketches/${id}/metadata.ts`).then(
        (mod: MetadataModule) => mod.default
      );

      const Component = dynamic(
        () => import(`../../sketches/${id}/sketch.tsx`),
        { ssr: false, loading: SketchLoading }
      );

      /* this is in accordance with next.js static file serving, 
      https://nextjs.org/docs/app/building-your-application/optimizing/static-assets
      */
      const imageUrl = metadata.imageUrl || `/sketches/${id}/cover.png`;

      return { id, ...metadata, Component, imageUrl };
    })
  );

  return sketches;
};
