import fs from "fs";
import path from "path";
import { NoteMetadata } from "@/lib/notes/types";

const parseFrontmatter = (fileContent: string) => {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(fileContent);
    const frontMatterBlock = match![1];
    const content = fileContent.replace(frontmatterRegex, "").trim();
    const frontMatterLines = frontMatterBlock.trim().split("\n");
    const metadata: Partial<NoteMetadata> = {};
  
    frontMatterLines.forEach((line) => {
      const [key, ...valueArr] = line.split(": ");
      let value = valueArr.join(": ").trim();
      value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
      metadata[key.trim() as keyof NoteMetadata] = value as any;
    });
  
    return { metadata: metadata as NoteMetadata, content };
  };
  const getMDXFiles = (dir: string) => {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  };
  
  const readMDXFile = (filePath: string) => {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return parseFrontmatter(rawContent);
  };
  
  export function getMDXData(dir: string) {
    const mdxFiles = getMDXFiles(dir);
    return mdxFiles.map((file) => {
      const { metadata, content } = readMDXFile(path.join(dir, file));
      const slug = path.basename(file, path.extname(file));
      return {
        metadata,
        slug,
        content,
      };
    });
  }