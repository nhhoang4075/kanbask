import { get } from "@/actions/fetch-client";

export async function getConversations() {
  return get("/conversations");
}

export async function getParticipantsOfConversation(conversationId) {
  return get(`/conversations/${conversationId}`);
}
