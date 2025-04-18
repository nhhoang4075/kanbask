"use server";

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getConversationFromUserId(userId) {
    try {
        // Fetch conversations from the api
        const res = await fetch(`${url}/conversations?user_id=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const {success, data} = await res.json();
        if (!success) {
            console.error('Error registering user:', data);
            return null; // Handle error response
        }
        // Return conversations
        return data.conversations;
    } catch (error) {
        console.error('Error getting conversation from user ID:', error);
        return null;
    }
}

export async function addConversation(type, userIds) {
    try {
        const res = await fetch(`${url}/conversations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type, userIds }),
        });
        const {success, data} = await res.json();
        if (!success) {
            console.error('Error registering user:', data);
            return null; // Handle error response
        }
        // Return the conversation
        return data.conversation;
    } catch (error) {
        console.error('Error adding conversation:', error);
        return null;
    }
}

export async function deleteOneConversationById(conversationId) {
    try {
        const res = await fetch(`${url}/conversations/${conversationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const {success, message} = await res.json();
        if (!success) {
            console.error('Error deleting conversation:', data);
            return null; // Handle error response
        }
        return message;
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return null;
    }
}

export async function getParticipantsOfConversation(conversationId) {
    try {
        const res = await fetch(`${url}/conversations/${conversationId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const {success, data} = await res.json();
        if (!success) {
            console.error('Error registering user:', data);
            return null; // Handle error response
        }
        // Return conversations
        return data.participants;
    } catch (error) {
        console.error('Error getting participants:', error);
        return null;
    }
}