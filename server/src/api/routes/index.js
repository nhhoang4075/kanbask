import { Router } from "express";

import authRoute from "./auth-route.js";
import userRoute from "./user-route.js";
import conversationRoute from "./conversation-route.js";
import messageRoute from "./message-route.js";
import notificationRoute from "./notification-route.js";

const router = Router();

function apiRouter() {
  authRoute(router);
  userRoute(router);

  conversationRoute(router);
  messageRoute(router);
  notificationRoute(router);

  return router;
}

export default apiRouter;
