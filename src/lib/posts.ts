import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostType } from "./types";

function readPostFile(filePath: string): Post | null {
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const media = {
      image: data.imageURL,
    };
    const readingTimeMS = calculateReadingTimeMS(content);

    const slug = path.basename(filePath, path.extname(filePath));

    return {
      ...data,
      slug,
      content,
      readingTimeMS,
      media,
    } as Post;
  } catch (error) {
    console.error(`Failed to read or parse the file at ${filePath}:`, error);
    return null;
  }
}

function getFiles(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  } catch (error) {
    console.error(`Failed to read directory at ${dir}:`, error);
    return [];
  }
}

export const calculateReadingTimeMS = (
  content: string,
  wordsPerMinute: number = 220
) => {
  const words = content.split(/\s/g).length;
  const minutes = words / wordsPerMinute;
  const readTime = Math.floor(minutes * 60 * 1000);
  return readTime;
};


export function getPosts(directory: PostType): Post[] {

  const files = getFiles(
    path.join(process.cwd(), "src", "app", "(posts)", directory, "posts")
  );

  return files
    .map((file) =>
      readPostFile(
        path.join(
          process.cwd(),
          "src",
          "app",
          "(posts)",
          directory,
          "posts",
          file
        )
      )
    )
    .filter((post): post is Post => post !== null)
    .map((post) => {
      post.type = directory;
      return post;
    });
}

export const getAllPosts = () => {
  const types: PostType[] = ["projects", "sketches", "notes"];
  return types.map((type) => getPosts(type));
};
