import searchModel from "../models/search-model.js";
import teamModel from "../models/team-model.js";
// import projectModel from "../models/project-model.js";
import conversationModel from "../models/conversation-model.js";
import { generateEmbedding } from "../../config/embedding-provider.js";
import { sanitizeUser } from "../../utils/helper.js";

const searchUsers = async (searchTerm, options, actorId) => {
  try {
    if (!searchTerm) {
      return [];
    }

    const userTeams = await teamModel.getManyTeamsByUserId(actorId);
    const teamIds = userTeams.map((t) => t.id);
    const queryVector = await generateEmbedding(searchTerm);

    const users = await searchModel.searchUsersByVector(teamIds, searchTerm, queryVector, options);

    return users.map((u) => sanitizeUser(u));
  } catch (err) {
    throw err;
  }
};

const searchTasks = async (searchTerm, filters, options, actorId) => {
  try {
    if (!searchTerm) {
      return [];
    }

    const userProjects = await projectModel.getManyProjectsByUserId(actorId);
    const projectIds = userProjects.map((p) => p.id);
    const queryVector = await generateEmbedding(searchTerm);

    const tasks = await searchModel.searchTasksByVector(
      projectIds,
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

const searchMessages = async (conversationId, searchTerm, options, actorId) => {
  try {
    if (!searchTerm) {
      return [];
    }

    // const isConversationParticipant = conversationModel.isUserInConversation(actorId);

    // if (!isConversationParticipant) {
    //   return [];
    // }

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
  searchTasks,
  searchMessages
};
