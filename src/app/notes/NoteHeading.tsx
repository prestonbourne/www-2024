"use client";
import { Heading } from "@/components/markdown";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

// export function NoteHeader() {
//     const pathname = usePathname();
//     const hasNote = noteMap.has(pathname);
//     const router = useRouter();
//     if (!hasNote) {
//         router.push("/404");
//     }

//     const note = noteMap.get(pathname)!;

//     return (
//         <header>
//             <Heading level={1}>{note.title}</Heading>
//             <p>{new Date(note.publishDate).toLocaleDateString()}</p>
//         </header>
//     );
// }
