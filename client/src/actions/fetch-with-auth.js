"use server";

import { cookies } from "next/headers";

/**
 * A wrapper for fetch in Next.js Server Components,
 * automatically attaches access_token and refresh_token
 * from cookies into the Cookie header when calling APIs.
 *
 * @param {RequestInfo|URL} input - The request URL or RequestInfo.
 * @param {RequestInit & { cookieHeader?: string }} init - Optional fetch options and an override for the Cookie header.
 * @returns {Promise<Response>} - The fetch API Response.
 */
export async function fetchWithAuth(input, init = {}) {
  // 1. Retrieve cookies and extract token values
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // 2. Initialize headers from init or create a new Headers object
  const headers = new Headers(init.headers || {});

  // 3. Build the Cookie header string
  const cookieParts = [];
  if (accessToken) cookieParts.push(`access_token=${accessToken}`);
  if (refreshToken) cookieParts.push(`refresh_token=${refreshToken}`);

  if (init.cookieHeader) {
    // Use provided cookieHeader if present
    headers.set("Cookie", init.cookieHeader);
  } else if (cookieParts.length > 0) {
    headers.set("Cookie", cookieParts.join("; "));
  }

  // 4. Execute fetch with the assembled headers and include credentials
  return fetch(input, {
    ...init,
    headers,
    credentials: "include"
  });
}
