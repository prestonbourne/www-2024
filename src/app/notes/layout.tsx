import { Main } from "@/components/Main";

export default function NoteListLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <Main className="mt-12 max-w-3xl">
            {children}
        </Main>
    );
}
