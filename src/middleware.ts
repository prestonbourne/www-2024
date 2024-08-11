import { NextMiddleware, NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { isDeployedProduction } from "./lib";

let url = process.env.NEXT_PUBLIC_SITE_URL!;

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;
  const isNotePathWithSlug = request.nextUrl.pathname.startsWith("/notes/");
  console.log("middleware invoked", {
    pathname,
    isNotePathWithSlug,
  })
  if (!isNotePathWithSlug) {
    return NextResponse.next();
  }

  const updateViews = async () => {
    const slug = pathname.replace("/notes/", "");

    const url = isDeployedProduction()
      ? `${process.env.NEXT_PUBLIC_SITE_URL!}/api/increment_note_views`
      : "http://localhost:3000/api/increment_note_views";
    
    console.log({ url, slug });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_slug: slug,
      }),
    });
    if (res.status !== 200) {
      console.error("Failed to update views");

      try {
        const data = await res.json();
        console.error(data);
      } catch (e) {
        console.error(e);
      }
    }
  };
  event.waitUntil(updateViews());
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/notes/:path*",
};
