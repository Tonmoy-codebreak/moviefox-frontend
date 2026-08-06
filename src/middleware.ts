import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/media", "/mediadetails"];
const AUTH_ROUTES = ["/login", "/register"];
const USER_ROUTES = ["/watchlist", "/userprofile", "/completed"];
const ADMIN_ROUTES = [
  "/overview",
  "/mediamanage",
  "/reviewmanage",
  "/usermanage",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isUserRoute = USER_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if ((isUserRoute || isAdminRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/watchlist/:path*",
    "/userprofile/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
