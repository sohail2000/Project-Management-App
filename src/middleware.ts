import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const path = request.nextUrl.pathname;

    // const publicPaths = ["/", "/signin"];
    const protectedPaths = ["/project", "/profile"];

    // const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath));
    const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath));

    if (path === "/signin" && token) {
        return NextResponse.redirect(new URL("/project", request.url));
    }

    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/signin",
        "/project/:path*",
        "/profile",
    ],
};
