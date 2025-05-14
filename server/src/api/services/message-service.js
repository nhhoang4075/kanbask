import { StatusCodes } from "http-status-codes";

import messageModel from "../models/message-model.js";
import conversationModel from "../models/conversation-model.js";
import ApiError from "../../utils/api-error.js";
import embeddingProvider from "../../config/embedding-provider.js";
import { sanitizeAllowedFields } from "../../utils/helper.js";

const createOneMessage = async (data) => {
  try {
    const { conversation_id, sender_id, content } = data;
    const embedding = await embeddingProvider.generateEmbedding(data.content);

    const messageId = await messageModel.createOneMessage({
      conversation_id,
      sender_id,
      content,
      embedding
    });

    if (!messageId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create new message");
    }

    const message = await messageModel.getOneMessageById(messageId);

    return message;
  } catch (err) {
    throw err;
  }
};

const getManyMessagesByConversationId = async (conversationId, actorId) => {
  try {
    const isConversationParticipant = await conversationModel.isUserInConversation(
      conversationId,
      actorId
    );

    if (!isConversationParticipant) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Only participants of conversation can access this"
      );
    }

    const messages = messageModel.getManyMessagesByConversationId(conversationId);

    return messages;
  } catch (err) {
    throw err;
  }
};

const updateOneMessageById = async (id, data, actorId) => {
  try {
    const isMessageSender = await messageModel.isUserMessageSender(id, actorId);

    if (!isMessageSender) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only sender can access this");
    }

    const allowedData = sanitizeAllowedFields(data, ["content"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    const embedding = await embeddingProvider.generateEmbedding(allowedData.content);
    allowedData.embedding = embedding;

    const messageId = await messageModel.updateOneMessageById(id, allowedData);

    const message = await messageModel.getOneMessageById(messageId);

    return message;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneMessage,
  getManyMessagesByConversationId,
  updateOneMessageById
};
