import "dotenv/config";
import express, { json } from "express";
import { createServer } from "http";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";

import apiRouter from "./api/routes/index.js";

/**
 * Starts the server with Express and HTTP.
 *
 * @function startServer
 * @description Initializes an Express application, sets up an HTTP server, and configures routes.
 */
const startServer = () => {
  const app = express();
  const server = createServer(app);

  // Middlewares
  app.use(json());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
      credentials: true
    })
  );
  app.use(cookieParser());

  app.use("/api", apiRouter());

  app.get("/health-check", async (req, res) => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Healthcheck passed!"
    });
  });

  server.listen(process.env.APP_PORT || 8000, () => {
    console.log(`Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}`);
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
