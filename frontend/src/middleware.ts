import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Backward compatibility: the old admin login route now uses the unified login page.
  if (pathname === "/admin/login") {
    const loginUrl = new URL("/login", request.url);
    const from = request.nextUrl.searchParams.get("from");

    if (from && from.startsWith("/admin") && from !== "/admin/login") {
      loginUrl.searchParams.set("from", from);
    }

    return NextResponse.redirect(loginUrl);
  }

  const isAuthenticated = request.cookies.has("sa_auth");
  const role = request.cookies.get("sa_role")?.value;

  if (!isAuthenticated) {
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/login", request.url);
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
