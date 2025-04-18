// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const http = require("http");
const StatusCodes = require("http-status-codes").StatusCodes;
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const USERS_FILE = path.join(__dirname, "data/users.json");

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
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);
    socket.on("chat message", (msg) => {
      console.log("Message received: ", msg);
      io.emit("chat message", msg);
    });

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
  app.put("/api/users", (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    
    fs.readFile(USERS_FILE, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Failed to read users file" });
      }

      let users = JSON.parse(data);
      const userIndex = users.findIndex((user) => user.id === updatedUser.id);

      if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
      }
      users[userIndex] = { ...users[userIndex], ...updatedUser };

      fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to write users file" });
        }
        res.json({ message: "User updated successfully", user: users[userIndex] });
      });
    });
  });

  server.listen(process.env.APP_PORT || 8000, () => {
    console.log(
      `Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}`
    );
  });
}

startServer();
