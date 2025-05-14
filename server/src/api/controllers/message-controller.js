import { StatusCodes } from "http-status-codes";

import messageService from "../services/message-service.js";

const getManyMessagesByConversationId = async (req, res, next) => {
  try {
    const messages = await messageService.getManyMessagesByConversationId(
      req.params.conversation_id,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: { messages }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getManyMessagesByConversationId
};
