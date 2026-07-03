import { Server } from "socket.io";

import authMiddleware from "../middlewares/auth-middleware.js";
import registerConversationHandlers from "./conversation-socket.js";
import registerMessageHandlers from "./message-socket.js";
import registerTaskCommentHandlers from "./task-comment-socket.js";

let ioInstance = null;

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_ORIGIN, "https://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  ioInstance = io;

  io.use(authMiddleware.authenticateSocket);

  io.on("connection", (socket) => {
    // console.log("A client connected: " + socket.id);

    socket.on("setup", () => {
      const userId = socket.data.user.id;

      if (userId) {
        socket.join(`user_${userId}`);
        // console.log(`User ${userId} joined personal room`);
      }
    });

    registerConversationHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerTaskCommentHandlers(io, socket);

    // socket.on("disconnect", (reason) => {
    //   console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    // });

    // socket.on("error", (error) => {
    //   console.error("Socket Error on connection:", error);
    // });

    // socket.on("connect_error", (error) => {
    //   console.log(`connect_error due to ${error.message}`);
    // });
  });
};

export const getIoInstance = () => {
  if (!ioInstance) {
    // console.error("Socket.IO instance has not been initialized yet.");
  }
  return ioInstance;
};

export default setupSocket;
