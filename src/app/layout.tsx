import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { cx } from "class-variance-authority";
import { ThemeProvider } from "@/components/providers";
import { Flexbar } from "@/components/flexbar";


const bodyFont = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prestonbourne.dev"),
  title: {
    default: "Preston Bourne | Software Engineer",
    template: "%s | Preston Bourne",
  },
  description: "Chasing beautiful, performant software.",
  openGraph: {
    siteName: "Preston Bourne, Engineer & Designer",
    url: "https://prestonbourne.dev",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cx(
          bodyFont.className,
          "dark:text-gray-200 text-slate-800",
          "selection:bg-secondary selection:text-primary dark:bg-gray-950 dark:selection:text-lime-100 dark:selection:bg-lime-800 px-4",
          "max-w-screen-md mx-auto"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Flexbar />
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
