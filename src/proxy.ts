import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const USER_ROUTES = ["/watchlist", "/userprofile", "/completed"];
const ADMIN_ROUTES = [
  "/overview",
  "/mediamanage",
  "/reviewmanage",
  "/usermanage",
];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isUserRoute = USER_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // ১. প্রটেক্টেড রুটে টোকেন না থাকলে লগইনে রিডাইরেক্ট করা
  if ((isUserRoute || isAdminRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ২. লগইন থাকা অবস্থায় কেউ /login বা /register এ যেতে চাইলে তাকে তার রোল অনুযায়ী রিডাইরেক্ট করা
  if (isAuthRoute && token) {
    const redirectPath = userRole === "ADMIN" ? "/overview" : "/";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ৩. অ্যাডমিন ইউজার সাধারণ বা পাবলিক পেজগুলোতে (যেমন: /, /media ইত্যাদি) ঢুকতে গেলে সোজা /overview-এ পাঠিয়ে দেওয়া
  if (token && userRole === "ADMIN") {
    if (!isAdminRoute && !isAuthRoute) {
      return NextResponse.redirect(new URL("/overview", request.url));
    }
  }

  // ৪. সাধারণ ইউজার অ্যাডমিন রুটে (/overview ইত্যাদি) ঢুকতে চাইলে তাকে হোমপেজে পাঠিয়ে দেওয়া
  if (token && userRole !== "ADMIN" && isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * এটি সব রুট ট্র্যাক করবে, কিন্তু নেক্সটজেএসের নিজস্ব স্ট্যাটিক বা এপিআই ফাইল বাদ রাখবে।
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
