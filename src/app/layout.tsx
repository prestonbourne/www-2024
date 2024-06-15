import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const firaSans = Fira_Sans({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Preston Bourne",
    description: "Homepage of Preston Bourne, a Software Engineer and Designer.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${firaSans.className} bg-slate-50`}>
                {children}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}