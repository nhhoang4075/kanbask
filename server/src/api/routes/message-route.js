import messageValidation from "../validations/message-validation.js";
import messageController from "../controllers/message-controller.js";

const messageRoute = (router) => {
  router
    .route("/messages/:conversation_id")
    .get(
      messageValidation.validateConversationIdParam,
      messageController.getManyMessagesByConversationId
    );
};

export default messageRoute;
