import { Router } from "express";

import authRoute from "./auth-route.js";
import userRoute from "./user-route.js";
import teamRoute from "./team-route.js";
import projectRoute from "./project-route.js";
import conversationRoute from "./conversation-route.js";
import messageRoute from "./message-route.js";
import notificationRoute from "./notification-route.js";
import taskRoute from "./task-route.js";
import taskCommentRoute from "./task-comment-route.js";
import taskActivityLogRoute from "./task-activity-log-route.js";
import searchRoute from "./search-route.js";

const router = Router();

function apiRouter() {
  authRoute(router);
  userRoute(router);
  teamRoute(router);
  projectRoute(router);
  conversationRoute(router);
  messageRoute(router);
  notificationRoute(router);
  taskRoute(router);
  taskCommentRoute(router);
  taskActivityLogRoute(router);
  searchRoute(router);

  taskRoute(router);
  return router;
}

export default apiRouter;
