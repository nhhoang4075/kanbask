import { StatusCodes } from "http-status-codes";

import conversationService from "../services/conversation-service.js";

const createOneConversation = async (req, res, next) => {
  try {
    const conversationId = await conversationService.createOneConversation(
      req.body
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      conversationId,
    });
  } catch (error) {
    return next(error);
  }
};

const getManyConversationsByUserId = async (req, res, next) => {
  try {
    const conversations =
      await conversationService.getManyConversationsByUserId(req.params.userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: { conversations },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  createOneConversation,
  getManyConversationsByUserId,
};
