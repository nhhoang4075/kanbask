"use server";

export async function getMessages() {
    // Fetch messages from the api
    const res = await fetch("http://localhost:3000/api/messages", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
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
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
    // Handle error response
    if (!res.ok) {
        console.error("Error sending message:", res.statusText);
        return null;
    }
    return res.json();
}
export async function updateMesssages({ messages, changes }) {
    // Update messages in the api
    const res = await fetch("http://localhost:3000/api/messages", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(messages, changes),
    });
    // Handle error response
    if (!res.ok) {
        console.error("Error updating message:", res.statusText);
        return null;
    }
    return res.json();
}