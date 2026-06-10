// import { fetchWithAuth } from "@/actions/fetch-with-auth";

async function login({ email, password, remember }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password, remember })
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    } else {
      throw new Error("login API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function getSession() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    } else if (res.status === 401) {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include"
      });

      if (refreshRes.ok) {
        const retry = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          method: "GET",
          credentials: "include"
        });

        if (retry.ok) {
          const retryJson = await retry.json();

          if (!json.success) {
            throw new Error(json.message);
          }

          return retryJson.data;
        }
      } else {
        throw new Error("getSession API Error");
      }
    } else {
      throw new Error("getSession API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function logout() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.message;
    } else {
      throw new Error("logout API Error");
    }
  } catch (err) {
    throw err;
  }
}

export { login, getSession, logout };
