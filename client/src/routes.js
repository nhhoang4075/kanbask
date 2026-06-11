/**
 * An array of routes that are publicly accessible.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const PUBLIC_ROUTE = ["/"];

/**
 * An array of prefixes that are publicly accessible.
 * Routes with these prefixes do not require authentication.
 * @type {string[]}
 */
export const PUBLIC_ROUTE_PREFIXES = [];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to / path.
 * @type {string[]}
 */
export const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/forgot-password"
];

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/app";
