import { Server } from "socket.io";

import registerMessageHandlers from "./message-socket.js";

let ioInstance = null;

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "*",
      methods: ["GET", "POST"]
    }
  });

  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("A client connected: " + socket.id);

    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id);
    });

    socket.on("error", (error) => {
        console.error("Socket Error:", error);
    });
  });

  console.log("Socket.IO setup complete.");
};

export const getIoInstance = () => {
    if (!ioInstance) {
        console.error("Socket.IO instance has not been initialized yet.");
    }
    return ioInstance;
};

export default setupSocket;