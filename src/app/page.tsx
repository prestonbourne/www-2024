"use client";
import { Heading } from "@/pages/home/Heading";
import { PerlinCanvas } from "@/perlin";

export default function Home() {
    return (
        <>
            <main className="flex min-h-screen flex-row items-center justify-start max-w-screen-lg m-auto px-3">
                <Heading labels={["Software", "Graphics", "Interface"]} />
               
            </main>
            <PerlinCanvas />
        </>
    );
}
