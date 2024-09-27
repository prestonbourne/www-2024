import fs from "fs";
import path from "path";
import { WorkWithRoute } from "@/lib/work/types";
import { isValidWorkWithRoute, isValidWorkExternal } from "@/lib/work/utils";
import { getMDXData } from "../mdx-utils";
import { upsertWork } from "@/lib/work/upsert-work";
import { createAgnosticAdminClient } from "@/lib/supabase/server-client";

const fmtJson = (data: any) => JSON.stringify(data, null, 2);

export const getWorkContentFromDisk = (): WorkWithRoute[] => {
  const works = [];

  // Work with routes
  const workWithRoutesUncheked = getMDXData(
    path.join(process.cwd(), "content/work-routes")
  ).map((w) => {
    return {
      slug: w.slug,
      type: "work_route" as const,
      metadata: w.metadata,
      content: w.content,
    };
  });

  workWithRoutesUncheked.forEach((w) => {
    if (!isValidWorkWithRoute(w))
      throw Error("Build Failed.", {
        cause: `Work with route not matching schema: ${fmtJson(w)}`,
      });
  });
  works.push(...workWithRoutesUncheked);

  // Work with external links
  const workExternalPath = path.join(process.cwd(), "content/work-external");
  const workExtjsonFiles = fs
    .readdirSync(workExternalPath)
    .filter((file) => file.endsWith(".json"));

  const parsedJsonWorkExt = workExtjsonFiles.map((file) => {
    const filePath = path.join(workExternalPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  });
  parsedJsonWorkExt.forEach((w) => {
    if (!isValidWorkExternal(w))
      throw Error("Build Failed.", {
        cause: `Work with external not matching schema: ${fmtJson(w)}`,
      });
  });
  works.push(...parsedJsonWorkExt);

  return works;
};

type WorkMap = Record<string, WorkWithRoute>;
const buildWorksMap = (works: WorkWithRoute[]) => {
  const worksMap: WorkMap = {};
  works.forEach((work) => {
    worksMap[work.slug] = work;
  });

  return worksMap;
};

export default async function script() {
  const works = getWorkContentFromDisk();
  const supabase = createAgnosticAdminClient();

  const upsertPromises = [];

  for (const w of works) {
    if (w.type !== "work_route") continue;

    const promise = upsertWork(w, supabase)
      .then(() => {
        console.log(`Successfully Updated ${w.metadata.title}`);
      })
      .catch((err) => {
        console.error(`Error updating remote data for ${w.metadata.title}`);
        console.error(err);
      });

    upsertPromises.push(promise);
  }

  // Wait for all upsertWork calls to complete
  const results = await Promise.allSettled(upsertPromises);
  const failedResults = results.filter((r) => r.status === "rejected");
  if (failedResults.length > 0) {
    console.error("Failed to update the following works:");
    failedResults.forEach((r) => {
      // typescript compiler being a bit dumb here
      // @ts-ignore
      console.error(r.reason);
    });
    throw new Error("Failed to update some works");
  }else{
    console.log("All works updated successfully");
  }

  console.log("Building works map...");
  const worksMap = buildWorksMap(works);
  const worksMapPath = path.join(process.cwd(), "src/lib/work/worksMap.json");

  try {
    console.log("Writing works map to file...");
    fs.writeFileSync(worksMapPath, fmtJson(worksMap));
    console.log("Works map written to file successfully");
  } catch (e) {
    console.error("Failed to write works map to file:", e);
    throw e;
  }
}
