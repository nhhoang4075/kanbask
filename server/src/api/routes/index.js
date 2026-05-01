import { Router } from "express";

import authRoute from "./auth-route.js";
<<<<<<< HEAD
import userRoute from "./user-route.js";
=======
// import userRoute from "./user-route.js";
>>>>>>> a4649c7 (user with register and login)
// import conversationRoute from "./conversation-route.js";

const router = Router();

function apiRouter() {
  authRoute(router);
<<<<<<< HEAD
  userRoute(router);
=======
  // userRoute(router);
>>>>>>> a4649c7 (user with register and login)

  // conversationRoute(router);

  return router;
}

export default apiRouter;
