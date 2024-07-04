import { Fira_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import Image from "next/image";
import gradientImg from "public/gradient.webp";
import { cx } from "class-variance-authority";
import { ThemeProvider } from "@/components/providers";
import { Footer } from "@/components/footer";

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
      <body
        className={cx(
          firaSans.className,
          "text-body selection:bg-secondary selection:text-primary dark:selection:text-lime-100 dark:selection:bg-lime-800"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Image
            className="fixed left-0 top-0 -translate-x-1/3 -translate-y-1/3 scale-125 lg:-translate-y-1/2 md:translate-x-0 -z-10 md:scale-100 object-cover w-full opacity-20 blur-lg"
            src={gradientImg}
            role="presenation"
            alt=""
            priority
          />
          <div className="max-w-3xl mx-auto min-h-screen px-4 py-5 flex flex-col">
            <Nav />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>

      <SpeedInsights />
      <Analytics />
    </html>
  );
}
