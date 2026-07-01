import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/admin", "/community", "/skills", "/categories", "/category", "/saved", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // Check if this is a protected path
  const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(p + "/"));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for NextAuth session cookie (JWT token)
  const token = request.cookies.get("next-auth.session-token")?.value
    || request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // For admin routes, let the page component check the role
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/community/:path*", "/skills/:path*", "/categories/:path*", "/category/:path*", "/saved/:path*", "/profile/:path*"],
};
