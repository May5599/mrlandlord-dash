import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only protect dashboard
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Allow login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("company_admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // ✅ Do NOT verify token here
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
