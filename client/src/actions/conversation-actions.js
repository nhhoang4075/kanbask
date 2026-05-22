import { fetchWithAuth } from "@/actions/fetch-with-auth";

async function getConversations() {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations`, {
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
      throw new Error("getConversations API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function getParticipantsOfConversation(conversationId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${conversationId}`,
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
      throw new Error("getParticipantsOfConversation API Error");
    }
  } catch (err) {
    throw err;
  }
}

export { getConversations, getParticipantsOfConversation };
