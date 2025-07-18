import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    // Check for auth token in cookies
    const token = request.cookies.get('sb-access-token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin?message=admin_access', request.url))
    }
  }

  // Redirect to signin if trying to access auth pages with specific messages
  if (pathname.startsWith('/auth/signin') && request.nextUrl.searchParams.get('message')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*'
  ],
}