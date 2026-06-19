"use server";

import { get, put } from "@/actions/fetch-client";

export async function getNotifications() {
  return get("/notifications");
}

export async function markNotificationAsRead(notificationId) {
  return put(`/notifications/${notificationId}`);
}

export async function markAllNotificationsAsRead() {
  return put("/notifications");
}
