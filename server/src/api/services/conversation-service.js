import { StatusCodes } from "http-status-codes";

import conversationModel from "../models/conversation-model.js";
import ApiError from "../../utils/api-error.js";

const createOneConversation = async (data) => {
  try {
    const { type, team_id, project_id, user_ids } = data;

    const conversationId = await conversationModel.createOneConversation(type, team_id, project_id);

    if (!conversationId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create the conversation");
    }

    await conversationModel.addParticipantsToConversation(conversationId, user_ids);

    const conversation = await conversationModel.getOneConversationById(conversationId);
    const participants = await conversationModel.getParticipantsOfConversation(conversationId);

    const formattedConversation = {
      ...conversation,
      participants: participants.map((p) => ({
        user_id: p.user_id
      }))
    };

    return formattedConversation;
  } catch (err) {
    throw err;
  }
};

const getManyConversationsByUserId = async (userId) => {
  try {
    const conversations = await conversationModel.getManyConversationsByUserId(userId);

    return conversations;
  } catch (err) {
    throw err;
  }
};

const deleteOneConversation = async (conversationId) => {
  try {
    await conversationModel.deleteOneConversationById(conversationId);

    return conversationId;
  } catch (err) {
    throw err;
  }
};

const getParticipantsOfConversation = async (conversationId) => {
  try {
    const participants = await conversationModel.getParticipantsOfConversation(conversationId);

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
