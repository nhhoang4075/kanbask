import { Router } from "express";

import authRoute from "./auth-route.js";
import userRoute from "./user-route.js";
import conversationRoute from "./conversation-route.js";

const router = Router();

function apiRouter() {
  authRoute(router);
  userRoute(router);

  conversationRoute(router);

  return router;
}

export default apiRouter;
