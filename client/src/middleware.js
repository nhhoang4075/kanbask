import { NextResponse } from "next/server";

import { PUBLIC_ROUTE, PUBLIC_ROUTE_PREFIXES, AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "@/routes";

/**
 * Middleware to guard protected routes.
 * - Skips public routes and assets.
 * - Verifies JWT token via getSession (server-side).
 * - Redirects unauthenticated users to login with original path in query.
 * - Prevents logged-in users from accessing auth pages.
 */
export async function middleware(request) {
  const { nextUrl: url, cookies } = request;
  let pathname = url.pathname;

  const isPublicRoute =
    PUBLIC_ROUTE.includes(pathname) ||
    PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isPublicRoute) {
    console.log(1);

    return NextResponse.next();
  }

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const access_token = cookies.get("access_token")?.value;
  const refresh_token = cookies.get("refresh_token")?.value;
  const isAutheticated = access_token || refresh_token;

  if (!isAutheticated && !isAuthRoute) {
    url.pathname = "/auth/login";
    url.search = `redirect=${encodeURIComponent(pathname)}`;

    return NextResponse.redirect(url);
  }

  if (isAutheticated && isAuthRoute) {
    url.pathname = DEFAULT_LOGIN_REDIRECT;

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Apply middleware to all protected routes, skipping Next.js internals & static files
 */
export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
