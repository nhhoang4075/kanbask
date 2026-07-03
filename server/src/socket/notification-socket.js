import { getIoInstance } from "./index.js";

const emitNewNotification = (userId, notification) => {
  const io = getIoInstance();

  if (io && userId && notification) {
    io.to(`user_${userId}`).emit("new_notification", notification);
  }
};

export { emitNewNotification };
