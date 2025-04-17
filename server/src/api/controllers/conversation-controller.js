import { StatusCodes } from "http-status-codes";

import conversationService from "../services/conversation-service.js";

const createOneConversation = async (req, res, next) => {
  try {
    const conversation = await conversationService.createOneConversation(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        conversation
      }
    });
  } catch (error) {
    next(error);
  }
};

const getManyConversationsByUserId = async (req, res, next) => {
  try {
    const conversations = await conversationService.getManyConversationsByUserId(req.query.user_id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

const deleteOneConversation = async (req, res, next) => {
  try {
    const conversation = await conversationService.deleteOneConversation(req.params.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Deleted successfully conversation with id ${conversation.id}`
    });
  } catch (error) {
    next(error);
  }
};

const getParticipantsOfConversation = async (req, res, next) => {
  try {
    const participants = await conversationService.getParticipantsOfConversation(req.params.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        participants
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createOneConversation,
  getManyConversationsByUserId,
  deleteOneConversation,
  getParticipantsOfConversation
};
