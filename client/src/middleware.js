import { NextResponse } from "next/server";
import { auth } from "@/auth";

const authRoutes = ["/", "/register"];
const dashboardPrefix = "/dashboard";
const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export default auth((req) => {
  const { nextUrl } = req;
  // ! IMPORTANT: can not use nextUrl.host because it is localhost
  const originalUrl = req.nextUrl.protocol + "//" + req.headers.get("x-forwarded-host");
  const session = req.auth;
  const isLoggedIn = !!session;
  const isNormalUser = session?.user?.role === "user";
  const isDashboardRoute = nextUrl.pathname.startsWith(dashboardPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
  // * Handle dashboard routes that use for management
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/", originalUrl));
    }
    if (isLoggedIn && isNormalUser && nextUrl.pathname !== DEFAULT_LOGIN_REDIRECT) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, originalUrl)
      );
    }
    return NextResponse.next();
  }

  // * Handle routes that used for authentication
  if (isAuthRoute) {
    if (isLoggedIn && nextUrl.pathname !== DEFAULT_LOGIN_REDIRECT) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, originalUrl)
      );
    }
    return NextResponse.next();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // * Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // * Always run for API routes
    "/(api|trpc)(.*)",
    "/"
  ],
};