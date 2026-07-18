import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin login page is always public — never apply auth checks here
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.has("sa_auth");
  const role = request.cookies.get("sa_role")?.value;

  if (!isAuthenticated) {
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated customer trying to reach admin routes → customer dashboard
  if (pathname.startsWith("/admin") && role !== "ROLE_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
