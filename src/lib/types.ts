/* 
    Nextjs does not have a built-in way to define types for server components
*/
export interface NextPageProps<SlugType = string> {
	params: { slug: SlugType };
	searchParams?: { [key: string]: string | string[] | undefined };
}