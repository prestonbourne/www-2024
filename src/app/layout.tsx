import { Fira_Sans } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const firaSans = Fira_Sans({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
                <title>Preston Bourne | Software Engineer</title>
                <meta name="description" content="Chasing beautiful, performant software." />
                <meta name="og:title" content="Preston Bourne | Software Engineer" />
            </Head>
            <body className={`${firaSans.className} bg-light dark:bg-dark text-light dark:text-dark`}>
                {children}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}