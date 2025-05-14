import { StatusCodes } from "http-status-codes";
import searchService from "../services/search-service.js";

const searchUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const searchTerm = req.query.q || "";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const users = await searchService.searchUsers(searchTerm, { limit, offset }, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

const searchTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const searchTerm = req.query.q || "";
    const status = req.query.status;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const tasks = await searchService.searchTasks(
      searchTerm,
      { status },
      { limit, offset },
      userId
    );

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
    const userId = req.user.id;
    const searchTerm = req.query.q || "";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const conversationId = req.query.conversation_id;

    const messages = await searchService.searchMessages(
      conversationId,
      searchTerm,
      { limit, offset },
      userId
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
  searchUsers,
  searchTasks,
  searchMessages
};
