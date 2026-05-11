import conversationValidation from "../validations/conversation-validation.js";
import conversationController from "../controllers/conversation-controller.js";

const conversationRoute = (router) => {
  router
    .route("/conversations")
    .get(conversationValidation.validateUserId, conversationController.getManyConversationsByUserId)
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
