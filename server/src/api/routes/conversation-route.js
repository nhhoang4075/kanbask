import conversationValidation from "../validations/conversation-validation.js";
import conversationController from "../controllers/conversation-controller.js";

const conversationRoute = (router) => {
  router
    .route("/conversations/of/:userId")
    .get(
      conversationValidation.validateUserIdParam,
      conversationController.getManyConversationsByUserId
    );

  router
    .route("/conversations")
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
