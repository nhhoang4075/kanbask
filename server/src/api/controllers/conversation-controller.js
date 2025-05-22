import { StatusCodes } from "http-status-codes";

import conversationService from "../services/conversation-service.js";

const getConversationsOfUser = async (req, res, next) => {
  try {
    const conversations = await conversationService.getManyConversationsByUserId(req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

const getParticipantsOfConversation = async (req, res, next) => {
  try {
    const participants = await conversationService.getParticipantsOfConversation(
      req.params.id,
      req.user.id
    );

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
  getConversationsOfUser,
  getParticipantsOfConversation
};
