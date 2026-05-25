import { StatusCodes } from "http-status-codes";
import searchService from "../services/search-service.js";

const searchUsers = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Authentication required." });
    }

    const userId = req.user.id;
    const searchTerm = req.query.q || "";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const users = await searchService.searchUsers(userId, searchTerm, { limit, offset });

    res.status(StatusCodes.OK).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

const searchMyTasks = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Authentication required." });
    }

    const userId = req.user.id;
    const searchTerm = req.query.q || "";
    const status = req.query.status;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const filters = { status };

    const tasks = await searchService.searchMyTasks(userId, searchTerm, filters, { limit, offset });

    res.status(StatusCodes.OK).json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

const searchMessages = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Authentication required." });
    }

    const searchTerm = req.query.q || "";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const conversationId = req.query.conversation_id;

    const messages = await searchService.searchMessages(conversationId, searchTerm, {
      limit,
      offset
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: { messages }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  searchUsers,
  searchMyTasks,
  searchMessages
};
