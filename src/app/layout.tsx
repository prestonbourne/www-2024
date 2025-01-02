import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { cx } from "class-variance-authority";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/footer";
import { VercelToolbar } from "@vercel/toolbar/next";
import { TableOfContents } from "@/components/posts/table-of-contents";

const bodyFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prestonbourne.dev"),
  title: {
    default: "Preston Bourne | Engineer",
    template: "%s | Preston Bourne",
  },
  description: "Chasing beautiful, performant software.",
  openGraph: {
    siteName: "Preston Bourne | Engineer",
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
  const shouldInjectToolbar = process.env.NODE_ENV === "development";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cx(
          bodyFont.className,
          "selection:bg-foreground-muted/20 selection:text-foreground-highlight",
          "text-foreground overflow-x-hidden",
          "relative", // for flexbar v0
          "bg-background"
        )}
      >
        <Providers>
          <div className="2xl:grid 2xl:grid-cols-4 2xl:gap-8 mt-12">
            {/* empty div to push the table of contents to the right in 3 column layout */}
            <div
              aria-hidden="true"
              className="2xl:col-span-1 hidden 2xl:block"
            ></div>
            <div className="2xl:col-span-2 max-w-screen-md px-4 mx-auto 2xl:px-0">
              {children} <Footer />{" "}
            </div>
            <div className="2xl:col-span-1 hidden 2xl:block">
              <TableOfContents
                className="fixed"
                routes={["/projects", "/notes"]}
              />
            </div>
          </div>
        </Providers>
        {shouldInjectToolbar && <VercelToolbar />}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
