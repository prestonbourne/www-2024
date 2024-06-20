import { Fira_Sans } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Metadata } from "next";

const firaSans = Fira_Sans({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Preston Bourne | Software Engineer",
    description: "Chasing beautiful, performant software.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${firaSans.className} bg-light dark:bg-dark text-light dark:text-dark`}>
                {children}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}