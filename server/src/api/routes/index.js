import { Router } from "express";
import conversationRoute from "./conversation-route.js";
import userRoute from "./user-route.js";

const router = Router();

function apiRouter() {
  conversationRoute(router);
  userRoute(router);
  return router;
}

export default apiRouter;
