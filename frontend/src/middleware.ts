import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessTokenCookie =
    req.cookies.get("accessToken")?.value.trim() || null;
  const refreshTokenCookie =
    req.cookies.get("refreshToken")?.value.trim() || null;

  const publicRoutes = ["/login", "/signup", "/"];

  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  if (isPublicRoute && accessTokenCookie && refreshTokenCookie) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublicRoute) {
    if (!refreshTokenCookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!accessTokenCookie) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
};
