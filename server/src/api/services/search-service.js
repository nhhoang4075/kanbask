import searchModel from "../models/search-model.js";
import { sanitizeUser } from "../../utils/helper.js";
import { generateEmbedding } from "../../config/embedding.js";

const searchUsers = async (userId, searchTerm, options) => {
  try {
    const queryVector = await generateEmbedding(searchTerm);

    const usersRaw = await searchModel.searchUsersByVector(
      userId,
      searchTerm,
      queryVector,
      options
    );
    return usersRaw.map((user) => sanitizeUser(user));
  } catch (err) {
    throw err;
  }
};

const searchMyTasks = async (userId, searchTerm, filters, options) => {
  try {
    const queryVector = await generateEmbedding(searchTerm);

    const tasks = await searchModel.searchMyTasksByVector(
      userId,
      searchTerm,
      queryVector,
      filters,
      options
    );
    return tasks;
  } catch (err) {
    throw err;
  }
};

const searchMessages = async (conversationId, searchTerm, options) => {
  try {
    const queryVector = await generateEmbedding(searchTerm);

    const messages = await searchModel.searchMessagesByVector(
      conversationId,
      searchTerm,
      queryVector,
      options
    );

    return messages;
  } catch (err) {
    throw err;
  }
};

export default {
  searchUsers,
  searchMyTasks,
  searchMessages
};
