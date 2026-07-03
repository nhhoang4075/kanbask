import { StatusCodes } from "http-status-codes";

import conversationModel from "../models/conversation-model.js";
import ApiError from "../../utils/api-error.js";

const getOneConversationById = async (id, actorId) => {
  try {
    const isConversationParticipant = await conversationModel.isUserInConversation(id, actorId);

    if (!isConversationParticipant) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Only participants of conversation can access this"
      );
    }

    const conversation = {
      ...(await conversationModel.getOneConversationById(id)),
      ...(await conversationModel.getDetailOfConversation(id, actorId))
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

const getParticipantsOfConversation = async (conversationId, actorId) => {
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

    const participants = await conversationModel.getParticipantsOfConversation(conversationId);

    return participants;
  } catch (err) {
    throw err;
  }
};

const updateConversationPendingStatus = async (conversationId, actorId) => {
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

    const conversation = await conversationModel.getOneConversationById(conversationId);

    if (conversation.is_pending) {
      await conversationModel.updateConversationPendingStatus(conversationId, false);
    }

    return conversationId;
  } catch (err) {
    throw err;
  }
};

const updateLastReadMessage = async (conversationId, actorId) => {
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

    const conversation = await conversationModel.getDetailOfConversation(conversationId, actorId);

    await conversationModel.updateLastReadMessage(
      conversationId,
      actorId,
      conversation.latest_message_id
    );

    return conversationId;
  } catch (err) {
    throw err;
  }
};

export default {
  getOneConversationById,
  getManyConversationsByUserId,
  getParticipantsOfConversation,
  updateConversationPendingStatus,
  updateLastReadMessage
};
