async function getSession() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const json = await res.json();

      return json.data;
    } else if (res.status === 401) {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`, {
        method: "GET",
        credentials: "include"
      });

      if (refreshRes.ok) {
        const retry = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          method: "GET",
          credentials: "include"
        });

        if (retry.ok) {
          const retryJson = await retry.json();

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
      method: "PUT",
      credentials: "include"
    });

    if (res.ok) {
      const json = await res.json();

      return json.data;
    } else {
      throw new Error("logout API Error");
    }
  } catch (err) {
    throw err;
  }
}

export default { getSession, logout };
