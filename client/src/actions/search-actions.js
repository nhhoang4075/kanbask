export async function getUserSearchResults(query, limit = 5, offset = 0) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search/users?limit=${limit}&offset=${offset}&q=${query}`, {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    } else {
      throw new Error("getUserSearchResults API Error");
    }
  } catch (err) {
    throw err;
  }
}
export async function getMessageSearchResults(query, conversationId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search/messages?q=${query}&conversation_id=${conversationId}`, {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    } else {
      throw new Error("getMessageSearchResults API Error");
    }
  } catch (err) {
    throw err;
  }
}
export async function getTaskSearchResults(query, status = "all", limit = 5, offset = 0) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search/tasks?q=${query}&status=${status}&limit=${limit}&offset=${offset}`, {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    } else {
      throw new Error("getTaskSearchResults API Error");
    }
  } catch (err) {
    throw err;
  }
}
