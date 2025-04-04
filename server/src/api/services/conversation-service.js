import { StatusCodes } from "http-status-codes";

import conversationModel from "../models/conversation-model.js";
import ApiError from "../../utils/api-error.js";

const createOneConversation = async (reqBody) => {
  try {
    const { type, team_id, project_id, user_ids } = reqBody;

    const conversation = await conversationModel.createOneConversation(type, team_id, project_id);

    if (!conversation.id) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create the conversation");
    }

    const participants = await conversationModel.addParticipantsToConversation(
      conversation.id,
      user_ids
    );

    if (!participants) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to add participants to the conversation"
      );
    }

    const createdConversation = {
      ...conversation,
      participants: participants.map((p) => ({
        user_id: p.user_id
      }))
    };

    return createdConversation;
  } catch (err) {
    throw err;
  }
};

const getManyConversationsByUserId = async (userId) => {
  try {
    const conversations = await conversationModel.getManyConversationsByUserId(userId);

    if (!conversations.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No conversations found");
    }

    return conversations;
  } catch (err) {
    throw err;
  }
};

const deleteOneConversation = async (conversationId) => {
  try {
    const deletedConversation = await conversationModel.deleteOneConversationById(conversationId);

    if (!deletedConversation.id) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Failed to delete the conversation");
    }

    return deletedConversation;
  } catch (err) {
    throw err;
  }
};

const getParticipantsOfConversation = async (conversationId) => {
  try {
    const participants = await conversationModel.getParticipantsOfConversation(conversationId);

    if (!participants) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to get participants of the conversation"
      );
    }

    return participants;
  } catch (err) {
    throw err;
  }
};

export default {
  createOneConversation,
  getManyConversationsByUserId,
  deleteOneConversation,
  getParticipantsOfConversation
};
