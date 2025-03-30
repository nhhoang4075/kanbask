"use server";

export async function validateUser(username, password) {
    // Use absolute URL for server-side requests
    const res = await fetch(`http://localhost:3000/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
        console.error('Error validating user:', res.statusText);
        return null; // Handle error response
    }
    const user = await res.json();
    return user;
}

export async function getConversations() {
    // Fetch conversations from the api
    const res = await fetch("http://localhost:3000/api/conversations", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    // Handle error response
    if (!res.ok) {
        console.error("Error fetching conversations:", res.statusText);
        return null; 
    }
    // Return conversations
    const conversations = await res.json();
    return conversations;
}
export async function addConversation({ conversation }) {
    // add conversation to the api
    const res = await fetch("http://localhost:3000/api/conversations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(conversation),
    });
    // Handle error response
    if (!res.ok) {
        console.error("Error adding conversation:", res.statusText);
        return null;
    }
    return res.json();
}
export async function updateConversation({ conversationId, messageId, timeSent }) {
    // update conversation to the api
    const res = await fetch("http://localhost:3000/api/conversations", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId, messageId, timeSent }),
    });
    // Handle error response
    if (!res.ok) {
        console.error("Error updating conversation:", res.statusText);
        return null;
    }
    return res.json();
}
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

export async function getUsers() {
    // Fetch users from the api
    const res = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    // Handle error response
    if (!res.ok) {
        console.error("Error fetching users:", res.statusText);
        return null; 
    }
    // Return Users
    const users = await res.json();
    return users;
}