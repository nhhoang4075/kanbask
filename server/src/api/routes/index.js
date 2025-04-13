import { Router } from "express";
import conversationRoute from "./conversation-route.js";
import projectRoute from "./project-route.js";

const router = Router();

function apiRouter() {
  conversationRoute(router);
  projectRoute(router);

  return router;
}

export default apiRouter;
