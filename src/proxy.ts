// src/proxy.ts — Di Next.js 16, file ini menggantikan middleware.ts
// (middleware.ts deprecated di Next.js 16, diganti dengan proxy.ts)
import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const user = await verifySessionToken(request.cookies.get(AUTH_COOKIE_NAME)?.value)

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
