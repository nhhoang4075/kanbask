import { Server } from "socket.io";

import authMiddleware from "../middlewares/auth-middleware.js";
import userModel from "../api/models/user-model.js";
import conversationService from "../api/services/conversation-service.js";
import registerConversationHandlers from "./conversation-socket.js";
import registerMessageHandlers from "./message-socket.js";
import registerTaskCommentHandlers from "./task-comment-socket.js";
import registerTypingHandlers from "./typing-socket.js";

let ioInstance = null;

// Real presence tracking: userId -> Set<socketId> of currently-open connections.
// A user is "online" as long as this set is non-empty (covers multiple open
// tabs/devices). Going offline is debounced so a page refresh's brief
// disconnect/reconnect doesn't flicker someone's status to everyone else.
const connectionsByUser = new Map();
const offlineTimers = new Map();
const OFFLINE_GRACE_MS = 5000;

const markUserOffline = (io, userId) => {
  offlineTimers.delete(userId);

  if (connectionsByUser.get(userId)?.size) return; // reconnected during the grace period

  const lastActive = new Date().toISOString();

  userModel.updateOneUserById(userId, { is_active: false, last_active: lastActive }).catch(() => {});
  io.emit("user_status_changed", { user_id: userId, is_active: false, last_active: lastActive });
};

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [...process.env.CLIENT_ORIGIN.split(","), "https://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  ioInstance = io;

  io.use(authMiddleware.authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.data.user?.id;

    if (userId) {
      const pendingOfflineTimer = offlineTimers.get(userId);
      if (pendingOfflineTimer) {
        clearTimeout(pendingOfflineTimer);
        offlineTimers.delete(userId);
      }

      const sockets = connectionsByUser.get(userId) ?? new Set();
      const wasOffline = sockets.size === 0;
      sockets.add(socket.id);
      connectionsByUser.set(userId, sockets);

      if (wasOffline) {
        userModel.updateOneUserById(userId, { is_active: true }).catch(() => {});
        io.emit("user_status_changed", { user_id: userId, is_active: true });
      }
    }

    socket.on("setup", () => {
      const userId = socket.data.user.id;

      if (userId) {
        socket.join(`user_${userId}`);
        // Fresh connections need the full current snapshot; going forward
        // they get incremental updates via "user_status_changed".
        socket.emit("online_users", Array.from(connectionsByUser.keys()));
      }
    });

    registerConversationHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerTaskCommentHandlers(io, socket);
    registerTypingHandlers(io, socket);

    socket.on("disconnect", () => {
      if (!userId) return;

      const currentConversationId = socket.data.conversation_id;
      if (currentConversationId) {
        conversationService
          .getParticipantsOfConversation(currentConversationId, userId)
          .then((participants) => {
            participants.forEach((p) => {
              io.to(`user_${p.id}`).emit("user_stopped_typing", {
                conversation_id: currentConversationId,
                user_id: userId
              });
            });
          })
          .catch(() => {});
      }

      const sockets = connectionsByUser.get(userId);
      if (!sockets) return;

      sockets.delete(socket.id);

      if (sockets.size === 0) {
        connectionsByUser.delete(userId);
        offlineTimers.set(
          userId,
          setTimeout(() => markUserOffline(io, userId), OFFLINE_GRACE_MS)
        );
      }
    });
  });
};

export const getIoInstance = () => {
  if (!ioInstance) {
    // console.error("Socket.IO instance has not been initialized yet.");
  }
  return ioInstance;
};

export default setupSocket;
