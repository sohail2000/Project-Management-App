import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const path = request.nextUrl.pathname



    // public paths
    const isPublicPath = path === '/signin';

    // If user is trying to access signin and is already authenticated, redirect to /project
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/project', request.url))
    }

    if (path === '/' && token) {
        return NextResponse.redirect(new URL('/project', request.url))
    }

    // If user is at root path and is not signed in, redirect to /signin
    if (path === '/' && !token) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    // If user is not authenticated and trying to access protected routes starting with /project
    if (path.startsWith('/project') && !token) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/signin',
        '/project/:path*',
    ]
}