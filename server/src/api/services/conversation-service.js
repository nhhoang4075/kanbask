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

const getOneConversationById = async (id, userId) => {
  try {
    const conversation = {
      ...(await conversationModel.getOneConversationById(id)),
      ...(await conversationModel.getDetailOfConversation(id, userId))
    };

    return conversation;
  } catch (err) {
    throw err;
  }
};

const getManyConversationsByUserId = async (userId) => {
  try {
    const conversations = await conversationModel.getManyConversationsByUserId(userId);

    const formattedConversations = await Promise.all(
      conversations.map(async (c) => ({
        ...c,
        ...(await conversationModel.getDetailOfConversation(c.id, userId))
      }))
    );

    formattedConversations.sort(
      (a, b) => new Date(b.latest_message_at) - new Date(a.latest_message_at)
    );

    return formattedConversations;
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

const updateLastReadMessage = async (conversationId, userId) => {
  try {
    const conversation = await conversationModel.getDetailOfConversation(conversationId, userId);

    await conversationModel.updateLastReadMessage(
      conversationId,
      userId,
      conversation.latest_message_id
    );

    return userId;
  } catch (err) {
    throw err;
  }
};

export default {
  createOneConversation,
  getOneConversationById,
  getManyConversationsByUserId,
  deleteOneConversation,
  getParticipantsOfConversation,
  updateLastReadMessage
};
