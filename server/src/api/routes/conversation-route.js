// const { validUserId } = require("../validations/conversation-validation");
import conversationController from "../controllers/conversation-controller.js";

const conversationRoute = (router) => {
  router
    .route("/conversations/:userId")
    .get(conversationController.getManyConversationsByUserId);
};

export default conversationRoute;
