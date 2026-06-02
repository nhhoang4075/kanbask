import { StatusCodes } from "http-status-codes";

import messageModel from "../models/message-model.js";
import conversationModel from "../models/conversation-model.js";
import ApiError from "../../utils/api-error.js";
import { generateEmbedding } from "../../config/embedding-provider.js";
import { sanitizeAllowedFields } from "../../utils/helper.js";

const createOneMessage = async (data) => {
  try {
    const { conversation_id, sender_id, content } = data;
    const embedding = await generateEmbedding(data.content);

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

const getManyMessagesByConversationId = async (conersationId, userId) => {
  try {
    const participants = await conversationModel.getParticipantsOfConversation(conersationId);

    const isParticipant = participants.some((p) => p.user_id === userId);

    if (!isParticipant) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You are not a participant of this conversation");
    }

    const messages = messageModel.getManyMessagesByConversationId(conersationId);

    return messages;
  } catch (err) {
    throw err;
  }
};

const updateOneMessageById = async (id, data) => {
  try {
    const allowedData = sanitizeAllowedFields(data, ["content"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    const embedding = await generateEmbedding(allowedData.content);
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
