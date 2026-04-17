// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const http = require("http");
const StatusCodes = require("http-status-codes").StatusCodes;
const socketIo = require("socket.io");

/**
 * Initializes and starts the HTTP server.
 *
 * This function creates an Express application and sets up the following routes:
 *
 * - GET "/" : Responds with a JSON object containing a test message.
 * - GET "/health-check" : Responds with a JSON object confirming that the health check has passed.
 *
 * The function then creates an HTTP server from the Express app and listens on a port specified by the
 * `APP_PORT` environment variable (defaulting to 8000 if not defined). When the server starts, it logs
 * a message displaying the host and port.
 *
 * @function startServer
 */
function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  app.use(express.json());

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    // Lắng nghe sự kiện 'chat message' từ client
    socket.on("chat message", (msg) => {
      console.log("Message received: ", msg);
      // Phát lại tin nhắn đến tất cả client
      io.emit("chat message", msg);
    });

    // Xử lý khi client ngắt kết nối
    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });

  app.get("/", function (req, res) {
    res.status(StatusCodes.OK).json({
      message: "Test GET API",
    });
  });

  app.get("/health-check", async function (req, res) {
    res.status(StatusCodes.OK).json({
      message: "Healthcheck API passed!",
    });
  });

  server.listen(process.env.APP_PORT || 8000, () => {
    console.log(
      `Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}`
    );
  });
}

startServer();
