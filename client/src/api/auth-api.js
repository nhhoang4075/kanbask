const login = async ({ email, password, remember }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password, remember })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const msg = errorData.message || res.statusText;
      throw new Error(`Login failed: ${msg}`);
    }

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.message);
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};

export { login };
