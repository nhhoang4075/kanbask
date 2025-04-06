import "dotenv/config";
import express, { json } from "express";
import { createServer } from "http";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
// const socketIo = require("socket.io");

import { connectDb, sql } from "./config/db.js";
import apiRouter from "./api/routes/index.js";

/**
 * Starts the server with Express, HTTP, and Socket.IO.
 *
 * @function startServer
 * @description Initializes an Express application, sets up an HTTP server, and integrates Socket.IO for real-time communication.
 *              Configures routes and handles WebSocket events for chat functionality.
 */
const startServer = () => {
  const app = express();
  const server = createServer(app);
  // const io = socketIo(server, {
  //   cors: {
  //     origin: "*",
  //     methods: ["GET", "POST"],
  //   },
  // });

  // Middlewares
  app.use(json()); // Parse JSON bodies
  app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000', 
      credentials: true 
  }));
  app.use(cookieParser()); // Parse cookies

  // io.on("connection", (socket) => {
  //   console.log("A user connected: " + socket.id);

  //   // Lắng nghe sự kiện 'chat message' từ client
  //   socket.on("chat message", (msg) => {
  //     console.log("Message received: ", msg);
  //     // Phát lại tin nhắn đến tất cả client
  //     io.emit("chat message", msg);
  //   });

  //   // Xử lý khi client ngắt kết nối
  //   socket.on("disconnect", () => {
  //     console.log("User disconnected: " + socket.id);
  //   });
  // });

  app.use("/api", apiRouter());

  app.get("/", async (req, res) => {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
  });

  app.get("/health-check", async (req, res) => {
    res.status(StatusCodes.OK).json({
      message: "Healthcheck API passed!",
    });
  });

  server.listen(process.env.APP_PORT || 8000, () => {
    console.log(
      `Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}`
    );
  });
};

// Only start the server after database connection is established (IIFE)
(() => {
  try {
    connectDb();
    startServer();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
