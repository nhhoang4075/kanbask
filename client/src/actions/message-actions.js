import { get } from "@/actions/fetch-client";

export async function getMessagesOfConversation(conversationId) {
  return get(`/messages?conversation_id=${conversationId}`);
}
