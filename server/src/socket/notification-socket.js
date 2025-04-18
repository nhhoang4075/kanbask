import { getIoInstance } from "./index.js";

const registerNotificationHandlers = (io, socket) => {
  socket.on("setup", ({ user_id }) => {
    if (user_id) {
      const roomName = `user_${user_id}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined notification room: ${roomName}`);
    }
  });
};

const emitNewNotification = (userId, notification) => {
  const io = getIoInstance();

  if (io && userId && notification) {
    io.to(`user_${userId}`).emit("new_notification", notification);
  }
};

export default registerNotificationHandlers;
export { emitNewNotification };
