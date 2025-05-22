// Lấy danh sách thông báo của user
async function getNotifications(options = {}) {
  try {
    const params = new URLSearchParams(options).toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications${params ? `?${params}` : ""}`,
      {
        method: "GET",
        credentials: "include"
      }
    );
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "getNotifications API Error");
    }
    return json.data;
  } catch (err) {
    throw err;
  }
}

// Đánh dấu 1 thông báo đã đọc
async function markNotificationAsRead(notificationId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notificationId}`,
      {
        method: "PUT",
        credentials: "include"
      }
    );
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "markNotificationAsRead API Error");
    }
    return json.data;
  } catch (err) {
    throw err;
  }
}

// Đánh dấu tất cả thông báo đã đọc
async function markAllNotificationsAsRead() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
      {
        method: "PUT",
        credentials: "include"
      }
    );
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "markAllNotificationsAsRead API Error");
    }
    return json.data;
  } catch (err) {
    throw err;
  }
}

export {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};