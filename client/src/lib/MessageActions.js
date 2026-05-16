"use server";

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getMessages() {
  // Fetch messages from the api
  const res = await fetch("http://localhost:3000/api/messages", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  // Handle error response
  if (!res.ok) {
    console.error("Error fetching messages:", res.statusText);
    return null;
  }
  // Return messages
  const messages = await res.json();
  return messages;
}
export async function sendMessage({ message }) {
  // Send message to the api
  const res = await fetch("http://localhost:3000/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });
  // Handle error response
  if (!res.ok) {
    console.error("Error sending message:", res.statusText);
    return null;
  }
  return res.json();
}
export async function updateMessages({ messageIds, changes }) {
  // Update messages in the api
  const res = await fetch("http://localhost:3000/api/messages", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messagesNeedChangeId: messageIds, changes: changes })
  });
  // Handle error response
  if (!res.ok) {
    console.error("Error updating message:", res.statusText);
    return { status: res.status };
  }
  return res.json();
}
export async function deleteMessages({ deleteMessageIds }) {
  // Delete messages in the api
  const res = await fetch("http://localhost:3000/api/messages", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ deleteMessageIds })
  });
  // Handle error response
  if (!res.ok) {
    console.error("Error deleting message:", res.statusText);
    return { status: res.status };
  }
  return res.json();
}
export async function getManyMessagesByConversationId(conversationId) {
  try {
    // Fetch messages from the api
    const res = await fetch(`${url}/messages/${conversationId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const { success, data } = await res.json();
    if (!success) {
      console.error("Error fetching messages:", data);
      return null; // Handle error response
    }
    // Return messages
    return data.messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null; // Handle error response
  }
}
