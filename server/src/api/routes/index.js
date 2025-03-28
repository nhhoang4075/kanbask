import { Router } from "express";
import conversationRoute from "./conversation-route.js";

const router = Router();

function apiRouter() {
  conversationRoute(router);

  return router;
}

export default apiRouter;
