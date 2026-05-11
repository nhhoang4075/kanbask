import { getIoInstance } from "./index.js";

const registerNotificationHandlers = (io, socket) => {
  socket.on("join_notification_room", ({ user_id }) => {
    if (user_id) {
      const roomName = `user_${user_id}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined notification room: ${roomName}`);
    } else {
      console.warn(`Socket ${socket.id} tried to join notification room without user_id.`);
    }
  });
};

export const emitNewNotification = (userId, notification) => {
  const io = getIoInstance();
  if (io && userId && notification) {
    const roomName = `user_${userId}`;
    io.to(roomName).emit("new_notification", notification);
    console.log(`Emitted 'new_notification' to room ${roomName}`);
  } else {
     console.warn("Could not emit 'new_notification'. IO instance or data missing.", { hasIo: !!io, userId, notification });
  }
};

export const emitNotificationUpdate = (userId, updateData) => {
    const io = getIoInstance();
    if (io && userId && updateData) {
        const roomName = `user_${userId}`;
        io.to(roomName).emit('notification_update', updateData);
        console.log(`Emitted 'notification_update' to room ${roomName}`, updateData);
    } else {
        console.warn("Could not emit 'notification_update'. IO instance or data missing.", { hasIo: !!io, userId, updateData });
    }
};

export default registerNotificationHandlers;