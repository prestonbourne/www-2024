/* 
    Nextjs does not have a built-in way to define types for server components
*/
export interface NextPageProps<SlugType = string> {
  params: { slug: SlugType };
  searchParams?: { [key: string]: string | string[] | undefined };
}


export type PostType = 'projects' | 'sketches' | 'notes';


export type Post = {
  type: PostType;
  title: string;
  slug: string;
  content: string;
  tags?: string[];
  description?: string;
  externalURL?: string;

  author?: {
    name?: string;
    link?: string;
    handle?: string;
  };

  publishedAt?: string;
  updatedAt?: string;

  media?: {
    image?: string;
    video?: string;
    audio?: string;
  };

  readingTimeMS?: number;

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  audience?: {
    likes?: number;
    views?: number;
    comments?: number;
  };

  related?: {
    media?: string[];
    links?: string[];
    posts?: string[];
  };

  social?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    pinterest?: string;
    others?: string[];
  };
};