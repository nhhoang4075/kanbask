import { StatusCodes } from "http-status-codes";

import ApiError from "../../utils/api-error.js";
import conversationModel from "../models/conversation-model.js";

const createOneConversation = async (reqBody) => {
  try {
    const { type, userIds } = reqBody;

    const { conversationId } = await conversationModel.createOneConversation(
      type,
      userIds
    );

    if (!conversationId) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create the conversation"
      );
    }

    return conversationId;
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

export default {
  createOneConversation,
  getManyConversationsByUserId,
};
