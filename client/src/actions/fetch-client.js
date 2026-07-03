import { API_URL, ApiError, handleResponse } from "@/lib/api-util";

async function api(endpoint, options = {}) {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...options.headers
  });

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

// HTTP method helpers
export async function get(endpoint, options = {}) {
  return api(endpoint, { method: "GET", ...options });
}

export async function post(endpoint, data, options = {}) {
  return api(endpoint, { method: "POST", body: data, ...options });
}

export async function put(endpoint, data, options = {}) {
  return api(endpoint, { method: "PUT", body: data, ...options });
}

export async function del(endpoint, data, options = {}) {
  return api(endpoint, { method: "DELETE", body: data, ...options });
}
