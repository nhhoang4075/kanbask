import { Server } from "socket.io";

import registerConversationHandlers from "./conversation-socket.js";
import registerMessageHandlers from "./message-socket.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("A client connected: " + socket.id);

    socket.on("setup", ({ user_id }) => {
      socket.join(`user_${user_id}`);
      // console.log(`User ${user_id} joined personal room`);
    });

    registerConversationHandlers(io, socket);
    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id);
    });
  });
};

export default setupSocket;
