import messageValidation from "../validations/message-validation.js";
import messageController from "../controllers/message-controller.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const messageRoute = (router) => {
  router.use("/messages", authMiddleware.authenticate);

  router
    .route("/messages")
    .get(
      messageValidation.validateConversationIdQuery,
      messageController.getMessagesOfConversation
    );
};

export default messageRoute;
