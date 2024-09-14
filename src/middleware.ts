import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { incrementViewsBySlug } from './lib/work'
import { createAgnosticAdminClient } from './lib/supabase/server-client'


export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const workSlug = pathname.split('/').pop()

  /*
  intentionally not using 
  https://vercel.com/docs/projects/environment-variables/system-environment-variables
  allows for ensuring the views increments in previews
*/
 const inProd = process.env.NODE_ENV !== 'development'
 console.log(process.env)

 // because the `public` also has /work dir, exclude anything with a file extension
 if (workSlug && !pathname.includes('.') && inProd) {
    incrementViewsBySlug(workSlug, createAgnosticAdminClient())
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/work/:slug((?!.*\\.).+$)',
}
