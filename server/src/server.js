import "dotenv/config";
import express, { json } from "express";
import { createServer } from "https";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { handleApiError } from "./middlewares/error-middleware.js";
import apiRouter from "./api/routes/index.js";
import setupSocket from "./socket/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certPath = path.join(__dirname, "../certificates", "localhost.pem");
const keyPath = path.join(__dirname, "../certificates", "localhost-key.pem");

/**
 * Starts the server with Express and HTTP.
 *
 * @function startServer
 * @description Initializes an Express application, sets up an HTTP server, and configures routes.
 */
const startServer = () => {
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  const app = express();
  const server = createServer(httpsOptions, app);

  // Middlewares
  app.use(json());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "https://localhost:3000",
      credentials: true
    })
  );
  app.use(cookieParser());

  app.use("/api", apiRouter());
  setupSocket(server);
  app.use(handleApiError);

  app.get("/", async (req, res) => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "OK"
    });
  });

  app.get("/health-check", async (req, res) => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Healthcheck passed!"
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
    console.log(`Server is running at https://${process.env.APP_HOST}:${process.env.APP_PORT}`);
  });
};

(() => {
  try {
    startServer();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
