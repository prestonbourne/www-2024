import fs from "fs";
import path from "path";

type Metadata = {
    title: string;
    publishedAt: string;
    description: string;
    image?: string;
    featured?: string;
    tag?: string;
};

export type Note = {
    slug: string;
    metadata: Metadata;
    content: string;
};

const parseFrontmatter = (fileContent: string) => {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(fileContent);
    const frontMatterBlock = match![1];
    const content = fileContent.replace(frontmatterRegex, "").trim();
    const frontMatterLines = frontMatterBlock.trim().split("\n");
    const metadata: Partial<Metadata> = {};

    frontMatterLines.forEach(line => {
        const [key, ...valueArr] = line.split(": ");
        let value = valueArr.join(": ").trim();
        value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
        metadata[key.trim() as keyof Metadata] = value as any;
    });

    return { metadata: metadata as Metadata, content };
};
const getMDXFiles = (dir: string) => {
    return fs.readdirSync(dir).filter(file => path.extname(file) === ".mdx");
};

const readMDXFile = (filePath: string) => {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return parseFrontmatter(rawContent);
};

function getMDXData(dir: string) {
    const mdxFiles = getMDXFiles(dir);
    return mdxFiles.map(file => {
        const { metadata, content } = readMDXFile(path.join(dir, file));
        const slug = path.basename(file, path.extname(file));
        return {
            metadata,
            slug,
            content,
        };
    });
}

const noteCache: Note[] = [];
export const getNotes = (): Note[] => {

    if (noteCache.length) {
        return noteCache;
    }
    const data = getMDXData(path.join(process.cwd(), "src/note-content"));
    
    data.sort((a, b) => {
        return (
            +new Date(b.metadata.publishedAt) -
            +new Date(a.metadata.publishedAt)
        );
    });
    noteCache.push(...data);
    return data;
};

export const getNoteBySlug = (slug: string): Note | undefined => {
    return getNotes().find(note => note.slug === slug);
};
