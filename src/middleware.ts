import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { incrementViewsBySlug } from './lib/work'
import { createAdminSSRClient } from './lib/supabase/server-client'

export async function middleware(request: NextRequest, ev: NextFetchEvent) {
  const pathname = request.nextUrl.pathname

  const pathArr = pathname.split('/')
  const workSlug = pathArr[pathArr.length - 1]

  /*
  also want to work in previews
  https://vercel.com/docs/projects/environment-variables/system-environment-variables
*/
  const inProd = process.env['VERCEL_ENV'] !== 'development'
  if (workSlug && inProd) {
    ev.waitUntil(incrementViewsBySlug(workSlug, createAdminSSRClient()))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/work/:slug((?!.*\\.).+$)',
}
