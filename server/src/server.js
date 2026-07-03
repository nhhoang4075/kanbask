import "dotenv/config";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import express, { json } from "express";
import { createServer } from "http";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

import apiRouter from "./api/routes/index.js";
import setupSocket from "./socket/index.js";
import embeddingProvider from "./config/embedding-provider.js";
import { handleApiError } from "./middlewares/error-middleware.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const certPath = path.join(__dirname, "../certificates", "localhost.pem");
// const keyPath = path.join(__dirname, "../certificates", "localhost-key.pem");

/**
 * Starts the server with Express and HTTP.
 *
 * @function startServer
 * @description Initializes an Express application, sets up an HTTP server, and configures routes.
 */
const startServer = () => {
  // const httpsOptions = {
  //   key: fs.readFileSync(keyPath),
  //   cert: fs.readFileSync(certPath)
  // };
  const app = express();
  const server = createServer(app);
  // const server = createServer(httpsOptions, app);

  setupSocket(server);

  // Middlewares
  app.use(json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: [process.env.CLIENT_ORIGIN, "http://localhost:3000"],
      credentials: true
    })
  );

  app.use("/api", apiRouter());
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

  server.listen(process.env.APP_PORT || 8080, () => {
    console.log(`Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}`);
  });
};

(async () => {
  try {
    await embeddingProvider
      .initialize()
      .then(() => {
        console.log("Embedding service pre-initialization process started successfully.");
      })
      .catch((err) => {
        throw err;
      });

    startServer();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
