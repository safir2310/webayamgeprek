import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Define protected routes and their allowed roles
const protectedRoutes = {
  '/admin/dashboard': ['admin'],
  '/admin/products': ['admin'],
  '/admin/orders': ['admin'],
  '/admin/users': ['admin'],
  '/admin/settings': ['admin'],
}

// Helper function to decode token
function decodeToken(token: string) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  // Middleware temporarily disabled - using client-side auth for now
  return NextResponse.next()

  /* Disabled for now
  const { pathname } = req.nextUrl

  // Check if the path is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route =>
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get token from Authorization header or cookie
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Decode token
  const decoded = decodeToken(token)
  if (!decoded || !decoded.userId) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Fetch user from database
  try {
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, email: true, name: true },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Check if user has access to this route
    const requiredRoles = Object.entries(protectedRoutes)
      .find(([route]) => pathname.startsWith(route))
      ?.[1]

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Add user info to headers for downstream use
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-role', user.role)
    response.headers.set('x-user-email', user.email)
    response.headers.set('x-user-name', user.name)

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  */
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
