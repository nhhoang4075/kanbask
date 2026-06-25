/**
import { PROTECTED_ROUTES } from './routes';
 * Routes that are accessible without authentication
 * @type {string[]}
 */
export const PUBLIC_ROUTES = [
  "/" // Landing page
];

/**
 * Routes that require authentication but not email verification
 * @type {string[]}
 */
export const PUBLIC_ROUTE_PREFIXES = [];

/**
 * Routes that require authentication and email verification
 * @type {string[]}
 */
export const PROTECTED_ROUTES = [
  // "/app/message",
  // "/app/calendar"
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to / path.
 * @type {string[]}
 */
export const AUTHENTICATION_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export const VERIFICATION_ROUTES = ["/auth/verify"];

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/app";
