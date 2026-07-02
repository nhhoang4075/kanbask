"use server";

import { cookies } from "next/headers";

import { API_URL, ApiError, handleResponse } from "@/lib/api-util";

async function apiServer(endpoint, options = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...options.headers
  });

  // Handle auth cookies
  if (accessToken || refreshToken) {
    const cookieParts = [];
    if (accessToken) cookieParts.push(`access_token=${accessToken}`);
    if (refreshToken) cookieParts.push(`refresh_token=${refreshToken}`);
    headers.set("Cookie", cookieParts.join("; "));
  }

  // Handle FormData
  if (options.body instanceof FormData) {
    headers.delete("Content-Type");
  } else if (options.body && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
  }

  const config = {
    ...options,
    headers,
    credentials: "include"
  };

  try {
    const res = await fetch(`${API_URL}/api${endpoint}`, config);
    return handleResponse(res);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
}

export async function getServer(endpoint, options = {}) {
  return apiServer(endpoint, { method: "GET", ...options });
}

export async function postServer(endpoint, data, options = {}) {
  return apiServer(endpoint, { method: "POST", body: data, ...options });
}

export async function putServer(endpoint, data, options = {}) {
  return apiServer(endpoint, { method: "PUT", body: data, ...options });
}

export async function delServer(endpoint, data, options = {}) {
  return apiServer(endpoint, { method: "DELETE", body: data, ...options });
}
