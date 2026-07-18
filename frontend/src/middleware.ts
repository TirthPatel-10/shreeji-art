import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin login page is always public — skip auth check to prevent redirect loop
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.has("sa_auth");

  if (!isAuthenticated) {
    // Admin routes → admin login
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Customer routes → customer login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/quotes/:path*",
    "/projects/:path*",
    "/profile",
  ],
};
