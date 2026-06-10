import conversationValidation from "../validations/conversation-validation.js";
import conversationController from "../controllers/conversation-controller.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const conversationRoute = (router) => {
  router.use("/conversations", authMiddleware.authenticate);

  router
    .route("/conversations")
    .get(conversationController.getConversationsOfUser)
    .post(
      conversationValidation.validateNewConversation,
      conversationController.createOneConversation
    );

  router
    .route("/conversations/:id")
    .get(
      conversationValidation.validateConversationIdParam,
      conversationController.getParticipantsOfConversation
    )
    .delete(
      conversationValidation.validateConversationIdParam,
      conversationController.deleteOneConversation
    );
};

export default conversationRoute;
