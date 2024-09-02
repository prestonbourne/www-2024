/* 
    Nextjs does not have a built-in way to define types for server components
*/
export interface NextPageProps<SlugType = string> {
  params: { slug: SlugType };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export type MDXEntity = {
  slug: string;
  metadata: MDXEntityMetadata;
  content: string;
};

export type MDXEntityMetadata = {
  title: string;
  publishedAt: string;
  description: string;
  imageURL?: string;
  tags?: string[];
};
