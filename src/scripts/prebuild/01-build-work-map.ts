import fs from "fs";
import path from "path";
import { WorkWithRoute } from "@/lib/work/types";
import { isValidWorkWithRoute, isValidWorkExternal } from "@/lib/work/utils";
import { getMDXData } from "../mdx-utils";

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

export default function script() {
  type WorkMap = Record<string, WorkWithRoute>;
  const buildWorksMap = (works: WorkWithRoute[]) => {
    const worksMap: WorkMap = {};
    works.forEach((work) => {
      worksMap[work.slug] = work;
    });

    return worksMap;
  };

  const works = getWorkContentFromDisk();

  const worksMap = buildWorksMap(works);
  const worksMapPath = path.join(process.cwd(), "src/lib/work/worksMap.json");

  try {
    fs.writeFileSync(worksMapPath, fmtJson(worksMap));
    console.log("Works map written to file successfully");
  } catch (e) {
    console.error("Failed to write works map to file:", e);
    throw e;
  }
}
