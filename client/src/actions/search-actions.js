import { get } from "@/actions/fetch-client";

function buildQueryString(params = {}, defaults = {}) {
  const { query = "", limit = 10, offset = 0, ...rest } = params;

  return new URLSearchParams({
    q: query,
    limit,
    offset,
    ...defaults,
    ...rest
  }).toString();
}

export async function searchUsers(params) {
  return get(`/search/users?${buildQueryString(params)}`);
}

export async function searchTasks(params) {
  return get(`/search/tasks?${buildQueryString(params, { status: "all" })}`);
}

export async function searchMessages(params) {
  const { conversationId, ...rest } = params;
  return get(`/search/messages?${buildQueryString(rest, { conversation_id: conversationId })}`);
}
