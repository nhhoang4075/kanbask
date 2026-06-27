import { get, put } from "@/actions/fetch-client";

function buildQueryString(params = {}, defaults = {}) {
  const { limit = 20, offset = 0, ...rest } = params;

  return new URLSearchParams({
    limit,
    offset,
    ...defaults,
    ...rest
  }).toString();
}

export async function getNotifications(params) {
  return get(`/notifications?${buildQueryString(params)}`);
}

export async function markNotificationAsRead(notificationId) {
  return put(`/notifications/${notificationId}`);
}

export async function markAllNotificationsAsRead() {
  return put("/notifications");
}
