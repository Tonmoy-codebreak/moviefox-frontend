import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const USER_ROUTES = ["/watchlist", "/userprofile", "/completed"];
const ADMIN_ROUTES = [
  "/overview",
  "/allmedia",
  "/addnewmedia",
  "/genres",
  "/pendingreviews",
  "/users",
  "/adminprofile",
];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("role")?.value;
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
    const redirectPath = userRole === "ADMIN" ? "/overview" : "/";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (token && userRole === "ADMIN") {
    if (!isAdminRoute && !isAuthRoute) {
      return NextResponse.redirect(new URL("/overview", request.url));
    }
  }

  if (token && userRole !== "ADMIN" && isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
