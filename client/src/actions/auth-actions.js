import { post, get } from "@/actions/fetch-client";

export async function register(data) {
  return post("/auth/register", data);
}

export async function login(data) {
  return post("/auth/login", data);
}

export async function getSession() {
  return get("/auth/me");
}

export async function refreshSession() {
  await post("/auth/refresh");
  return getSession();
}

export async function logout() {
  return post("/auth/logout");
}

export async function sendVerificationCode() {
  return post("/mail/verify-email");
}

export async function verifyEmail(code) {
  return post(`/auth/verify-email?code=${code}`);
}

export async function forgotPassword(email) {
  return post(`/mail/reset-password?email=${email}`);
}

export async function resetPassword(data) {
  return post("/auth/reset-password", data);
}
