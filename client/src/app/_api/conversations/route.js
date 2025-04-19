"use server";

import fsPromises from "fs/promises";
import path from "path";

const usersFilePath = path.join(process.cwd(), "src", "data", "conversations.json");

export async function GET() {
  try {
    const data = await fsPromises.readFile(usersFilePath, "utf-8");
    const conversations = JSON.parse(data);
    // Sort conversations by updatedAt in descending order
    conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return Response.json(conversations, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const conversation = await request.json();

    // Validate required fields
    if (
      !conversation.id ||
      !conversation.participants ||
      !Array.isArray(conversation.participants)
    ) {
      return Response.json(
        { error: 'Invalid conversation data. "id" and "participants" are required.' },
        { status: 400 }
      );
    }
    // Read existing conversations
    const data = await fsPromises.readFile(usersFilePath, "utf-8");
    const conversations = JSON.parse(data);
    // Add the new conversation
    conversations.unshift(conversation);
    // Sort conversations by updatedAt in descending order
    conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    // Write updated conversations back to the file
    await fsPromises.writeFile(usersFilePath, JSON.stringify(conversations, null, 2));
    return Response.json({ text: "Success", status: 201 });
  } catch (error) {
    console.error("Error adding conversation:", error);
    return Response.json(
      { error: `Failed to add conversation: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { conversationId, messageId, timeSent, command } = await request.json();
    const data = await fsPromises.readFile(usersFilePath, "utf-8");
    const conversations = JSON.parse(data);
    const conversationIndex = conversations.findIndex((conv) => conv.id === conversationId);
    if (conversationIndex === -1) {
      return Response.json({ error: "Conversation not found" }, { status: 404 });
    }
    if (command === "delete") {
      // Remove the messageId from the conversation's messageIds array
      conversations[conversationIndex].messageIds = conversations[
        conversationIndex
      ].messageIds.filter((id) => id !== messageId);
      // Update the updatedAt field to the latest message time
      conversations[conversationIndex].updatedAt = timeSent || new Date().toISOString();
    } else if (command === "add") {
      //update the messageIds array and updatedAt field
      conversations[conversationIndex].messageIds.push(messageId);
      conversations[conversationIndex].updatedAt = timeSent || new Date().toISOString();
    }
    // Sort conversations by updatedAt in descending order
    conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    // Write updated conversations back to the file
    await fsPromises.writeFile(usersFilePath, JSON.stringify(conversations, null, 2));
    return Response.json({ text: "Success", status: 200 });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return Response.json(
      { error: "Failed to update conversation: " + error.message },
      { status: 500 }
    );
  }
}
