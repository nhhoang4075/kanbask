import { StatusCodes } from "http-status-codes";

import ApiError from "../../utils/api-error.js";
import conversationModel from "../models/conversation-model.js";

const createOneConversation = async (reqBody) => {
  try {
    const { type, userIds } = reqBody;

    const conversation = await conversationModel.createOneConversation(type);

    if (!conversation.id) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create the conversation"
      );
    }

    const participants = await conversationModel.addParticipantsToConversation(
      conversation.id,
      userIds
    );

    if (!participants.length) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to add participants to the conversation"
      );
    }

    return { conversation, participants };
  } catch (err) {
    throw err;
  }
};

const getManyConversationsByUserId = async (userId) => {
  try {
    const conversations = await conversationModel.getManyConversationsByUserId(
      userId
    );

    if (!conversations.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No conversations found");
    }

    return conversations;
  } catch (err) {
    throw err;
  }
};

const updateOneConversation = async (conversationId, updateData) => {
  try {
    const conversation = await conversationModel.updateOneConversation(
      conversationId,
      reqBody
    );

    if (!conversation) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update the conversation"
      );
    }

    return conversation;
  } catch (err) {
    throw err;
  }
};

export default {
  createOneConversation,
  getManyConversationsByUserId,
};
