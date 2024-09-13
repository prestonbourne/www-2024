import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { incrementViewsBySlug } from './lib/work'
import { createAdminSSRClient } from './lib/supabase/server-client'


export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const workSlug = pathname.split('/').pop()

 // because the `public` also has /work dir, exclude anything with a file extension
 const inProd = process.env.NODE_ENV === 'production'
 if (workSlug && !pathname.includes('.') && inProd) {
    incrementViewsBySlug(workSlug, createAdminSSRClient())
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/work/:slug((?!.*\\.).+$)',
}
