import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/admin", "/community", "/skills", "/categories", "/category", "/saved", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(p + "/"));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("authjs.session-token")?.value
    || request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/community/:path*", "/skills/:path*", "/categories/:path*", "/category/:path*", "/saved/:path*", "/profile/:path*"],
};
