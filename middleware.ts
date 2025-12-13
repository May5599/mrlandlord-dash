// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;

//   const isLoginPage = path.startsWith("/tenant/login");
//   const isTenantRoute = path.startsWith("/tenant");
//   const token = req.cookies.get("tenant_session")?.value;

//   // 1. If already logged in and visiting login page → redirect to dashboard
//   if (isLoginPage && token) {
//     return NextResponse.redirect(new URL("/tenant/dashboard", req.url));
//   }

//   // 2. Protect all tenant pages except login
//   if (isTenantRoute && !token && !isLoginPage) {
//     return NextResponse.redirect(new URL("/tenant/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/tenant/:path*"],
// };




import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = req.cookies.get("tenant_session")?.value;

  const isLoginPage = path === "/tenant/login";

  // Allow login page always
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Allow API and next static files
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Allow dashboard to load even if middleware doesn’t see cookie yet
  if (path === "/tenant/dashboard") {
    return NextResponse.next();
  }

  // Protect all other tenant routes
  if (path.startsWith("/tenant") && !token) {
    return NextResponse.redirect(new URL("/tenant/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tenant/:path*"],
};
