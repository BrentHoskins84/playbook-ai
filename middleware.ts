import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/drills') ||
      req.nextUrl.pathname.startsWith('/practice-plans') ||
      req.nextUrl.pathname.startsWith('/teams')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  }

  // Auth routes - redirect to dashboard if already logged in
  if (req.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/drills/:path*', '/practice-plans/:path*', '/teams/:path*', '/auth/:path*'],
}