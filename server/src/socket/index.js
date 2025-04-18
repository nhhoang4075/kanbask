import { Server } from "socket.io";
import registerMessageHandlers from "./message-socket.js";
import registerNotificationHandlers from "./notification-socket.js";

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
    registerNotificationHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    });

    socket.on("error", (error) => {
      console.error("Socket Error on connection:", error);
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  });
};

export const getIoInstance = () => {
  if (!ioInstance) {
    console.error("Socket.IO instance has not been initialized yet.");
  }
  return ioInstance;
};

export default setupSocket;
