import { get } from "@/actions/fetch-client";
import { getServer } from "@/actions/fetch-server";

export async function getConversations() {
  return getServer("/conversations");
}

export async function getParticipantsOfConversation(conversationId) {
  return get(`/conversations/${conversationId}`);
}
