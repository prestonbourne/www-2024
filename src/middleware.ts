import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { incrementViewsBySlug } from './lib/work'
import { createAdminSSRClient } from './lib/supabase/server-client'


export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const workSlug = pathname.split('/').pop()

 // https://vercel.com/docs/projects/environment-variables/system-environment-variables
 const vercelEnv = process.env.VERCEL_ENV
 const inProd = !!vercelEnv && vercelEnv !== 'development'

 // because the `public` also has /work dir, exclude anything with a file extension
 if (workSlug && !pathname.includes('.') && inProd) {
    incrementViewsBySlug(workSlug, createAdminSSRClient())
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/work/:slug((?!.*\\.).+$)',
}
