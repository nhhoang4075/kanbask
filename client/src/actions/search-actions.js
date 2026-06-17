async function searchUsers(params) {
  try {
    const queryString = new URLSearchParams({
      q: params.query || "",
      limit: params.limit || 10,
      offset: params.offset || 0
    }).toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search/users?${queryString}`, {
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
      throw new Error("searchUsers API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function searchTasks(params) {
  try {
    const queryString = new URLSearchParams({
      q: params.query || "",
      status: params.status || "all",
      limit: params.limit || 10,
      offset: params.offset || 0
    }).toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search/tasks?${queryString}`, {
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
      throw new Error("searchTasks API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function searchMessages(params) {
  try {
    const queryString = new URLSearchParams({
      q: params.query || "",
      conversation_id: params.conversationId,
      limit: params.limit || 10,
      offset: params.offset || 0
    }).toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/search/messages?${queryString}`,
      {
        method: "GET",
        credentials: "include"
      }
    );

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    } else {
      throw new Error("searchMessages API Error");
    }
  } catch (err) {
    throw err;
  }
}

export { searchUsers, searchTasks, searchMessages };
