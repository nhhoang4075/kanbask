"use server";

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
export async function addConversation(conversation) {
    try {
        const res = await fetch("http://localhost:3000/api/conversations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(conversation),
        });
        if (!res.ok) {
            const error = await res.json();
            console.error("Error adding conversation:", error);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Error in addConversation:", error);
        return null;
    }
}
export async function updateConversation({ conversationId, messageId, timeSent }) {
    // Update the conversation in the api
    try {
        const res = await fetch("http://localhost:3000/api/conversations", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ conversationId, messageId, timeSent }),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Error updating conversation:", error);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Error in updateConversation:", error);
        return null;
    }
}