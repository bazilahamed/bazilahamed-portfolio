import { NextRequest, NextResponse } from 'next/server'

// Secret admin path — change this to whatever you want
const ADMIN_PATH = '/cmd-r9x4'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Redirect /admin to a 404-like decoy page
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.redirect(new URL('/404-not-found', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
