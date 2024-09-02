import { MetadataRoute } from "next";
import { getLocalWorks } from "@/lib/work/index";

export default function sitemap(): MetadataRoute.Sitemap {
  const workEntries: MetadataRoute.Sitemap = [];
  const works = getLocalWorks().filter((w) => w.type === "work_route");

  workEntries.push(
    ...works.map((work) => {
      return {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/work/${work.slug}`,
      };
    })
  );

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/work`,
    },
    ...workEntries
  ];
}
