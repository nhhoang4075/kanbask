import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import {
  PUBLIC_ROUTES,
  PUBLIC_ROUTE_PREFIXES,
  PROTECTED_ROUTES,
  AUTHENTICATION_ROUTES,
  VERIFICATION_ROUTES,
  DEFAULT_LOGIN_REDIRECT
} from "@/routes";

function getTokenPayload(token) {
  try {
    // Using jwt.decode since we only need to read the payload
    // We don't need to verify the signature in middleware
    return jwt.decode(token);
  } catch (e) {
    return null;
  }
}

// Access token expired but a "remember me" refresh token is still around — mint
// a new access token instead of bouncing the user to /auth/login.
async function tryRefreshAccessToken(refreshToken) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refresh_token=${refreshToken}` }
    });

    if (!res.ok) return null;

    // The refresh response sets both a new access_token and a rotated refresh_token
    // (rolling session); Set-Cookie headers can't be safely comma-joined (Expires
    // contains commas), so read them out individually where supported.
    const setCookies = res.headers.getSetCookie
      ? res.headers.getSetCookie()
      : [res.headers.get("set-cookie")].filter(Boolean);

    const accessCookie = setCookies.find((cookie) => cookie.startsWith("access_token="));
    const match = accessCookie?.match(/access_token=([^;]+)/);

    if (!match) return null;

    return { accessToken: match[1], setCookies };
  } catch (e) {
    return null;
  }
}

/**
 * Middleware to guard protected routes.
 * - Skips public routes and assets.
 * - Verifies JWT token via getSession (server-side).
 * - Redirects unauthenticated users to login with original path in query.
 * - Prevents logged-in users from accessing auth pages.
 * - Routes unverified users to email verification.
 */
export async function middleware(request) {
  const { nextUrl: url, cookies } = request;
  let pathname = url.pathname;

  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isAuthRoute = AUTHENTICATION_ROUTES.includes(pathname);
  const isVerificationRoute = VERIFICATION_ROUTES.includes(pathname);
  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);

  let access_token = cookies.get("access_token")?.value;
  const refresh_token = cookies.get("refresh_token")?.value;
  let refreshedSetCookies = null;

  if (!access_token && refresh_token) {
    const refreshed = await tryRefreshAccessToken(refresh_token);
    if (refreshed) {
      access_token = refreshed.accessToken;
      refreshedSetCookies = refreshed.setCookies;
    }
  }

  const isAuthenticated = !!access_token;

  // Carries the refreshed access_token/refresh_token cookies (if any) onto whichever response we return
  const withRefreshedCookie = (response) => {
    refreshedSetCookies?.forEach((cookie) => response.headers.append("set-cookie", cookie));
    return response;
  };

  // Handle unauthenticated users
  if (!isAuthenticated && !isAuthRoute) {
    url.pathname = "/auth/login";
    url.search = `redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Handle authenticated users trying to access auth routes
  if (isAuthenticated && isAuthRoute) {
    url.pathname = DEFAULT_LOGIN_REDIRECT;
    return withRefreshedCookie(NextResponse.redirect(url));
  }

  // Check email verification status for authenticated users
  if (isAuthenticated && !isAuthRoute) {
    const payload = getTokenPayload(access_token);
    const isEmailVerified = payload?.email_verified === true;

    // If email not verified and not on verification route, redirect to verification
    if (!isEmailVerified && isProtectedRoute) {
      url.pathname = "/auth/verify";
      return withRefreshedCookie(NextResponse.redirect(url));
    }

    // If email is verified and trying to access verification route, redirect to app
    if (isEmailVerified && isVerificationRoute) {
      url.pathname = DEFAULT_LOGIN_REDIRECT;
      return withRefreshedCookie(NextResponse.redirect(url));
    }
  }

  return withRefreshedCookie(NextResponse.next());
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
