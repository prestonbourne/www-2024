import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostType } from "./types";
import { createAdminClient } from "./supabase/server-client";

const supabase = createAdminClient();

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

export async function getPosts(directory: PostType): Promise<Post[]> {
  const files = getFiles(
    path.join(process.cwd(), "src", "app", "(posts)", directory, "posts")
  );

  return Promise.all(
    files
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
      .map(async (post) => {
        post.type = directory;

        const { data, error } = await supabase
          .from("posts")
          .select("audience_likes, audience_views")
          .eq("slug", post.slug)
          .single();
        if (data) {
          post.audience = {
            likes: data.audience_likes ?? 0,
            views: data.audience_views ?? 0,
          };
        } else {
          post.audience = {
            likes: 0,
            views: 0,
          };
        }
        if (error) {
          console.error(error);
        }
        return post;
      })
  );
}

export const getAllPosts = () => {
  const types: PostType[] = ["projects", "sketches", "notes"];
  return types.map((type) => getPosts(type));
};
