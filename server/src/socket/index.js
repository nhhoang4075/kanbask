import { Server } from "socket.io";

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

    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id);
    });
  });
};

export default setupSocket;
