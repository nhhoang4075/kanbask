import { StatusCodes } from "http-status-codes";

import projectModel from "../models/project-model.js";
import teamModel from "../models/team-model.js";
import userModel from "../models/user-model.js";
import conversationModel from "../models/conversation-model.js";
import notificationModel from "../models/notification-model.js";
import { emitNewNotification } from "../../socket/notification-socket.js";
import ApiError from "../../utils/api-error.js";
import { sanitizeAllowedFields } from "../../utils/helper.js";

const createOneProject = async (data, actorId) => {
  try {
    const allowedData = sanitizeAllowedFields(data, ["name", "description", "team_id"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    const isTeamMember = await teamModel.isUserInTeam(allowedData.team_id, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const teamRole = await teamModel.getTeamRoleOfUser(allowedData.team_id, actorId);

    if (teamRole !== "owner" && teamRole !== "admin") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only team owner or team admin can create project");
    }

    const projectId = await projectModel.createOneProject({
      ...allowedData,
      created_by: actorId
    });

    if (!projectId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create the project");
    }

    await projectModel.addMembersToProject(projectId, [actorId]);
    await projectModel.updateProjectRoleOfUser(projectId, actorId, "owner");

    const conversationId = await conversationModel.createOneConversation({
      type: "project",
      project_id: projectId
    });
    await conversationModel.addParticipantsToConversation(conversationId, [actorId]);

    const project = projectModel.getOneProjectById(projectId);

    return project;
  } catch (err) {
    throw err;
  }
};

const getManyProjectsByTeamId = async (teamId, actorId) => {
  try {
    const isTeamMember = await teamModel.isUserInTeam(teamId, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const projects = await projectModel.getManyProjectsByTeamId(teamId, actorId);

    return projects;
  } catch (err) {
    throw err;
  }
};

const updateOneProjectById = async (projectId, updateData, actorId) => {
  try {
    const isProjectMember = await projectModel.isUserInProject(projectId, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const role = await projectModel.getProjectRoleOfUser(projectId, actorId);

    if (role != "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can update project info");
    }

    const allowedData = sanitizeAllowedFields(updateData, ["name", "description"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    await projectModel.updateOneProjectById(projectId, allowedData);

    return projectId;
  } catch (err) {
    throw err;
  }
};

const deleteOneProjectById = async (projectId, actorId) => {
  try {
    const isProjectMember = await projectModel.isUserInProject(projectId, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const role = await projectModel.getProjectRoleOfUser(projectId, actorId);

    if (role != "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can delete project");
    }

    const conversation = await conversationModel.getOneConversationByProjectId(projectId);
    await conversationModel.deleteOneConversationById(conversation.id);

    await projectModel.deleteOneProjectById(projectId);

    return projectId;
  } catch (err) {
    throw err;
  }
};

const addMembersToProject = async (projectId, userIds, actorId) => {
  try {
    const isProjectMember = await projectModel.isUserInProject(projectId, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const role = await projectModel.getProjectRoleOfUser(projectId, actorId);

    if (role != "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can add members to project");
    }

    const project = await projectModel.getOneProjectById(projectId);
    const sanitizedUserIds = [];

    for (const userId of userIds) {
      const isTeamMember = await teamModel.isUserInTeam(project.team_id, userId);
      const isProjectMember = await projectModel.isUserInProject(projectId, userId);

      if (isTeamMember && !isProjectMember) {
        sanitizedUserIds.push(userId);
      }
    }

    await projectModel.addMembersToProject(projectId, sanitizedUserIds);

    const conversation = await conversationModel.getOneConversationByProjectId(projectId);
    await conversationModel.addParticipantsToConversation(conversation.id, sanitizedUserIds);

    const actor = await userModel.getOneUserById(actorId);
    for (const userId of sanitizedUserIds) {
      const user = await userModel.getOneUserById(userId);
      await notifyMembersOfProject(
        projectId,
        `<@${user.full_name}> was added to the project by <@${actor.full_name}>.`
      );
    }

    return projectId;
  } catch (err) {
    throw err;
  }
};

const getMembersOfProject = async (projectId, actorId) => {
  try {
    const isProjectMember = await projectModel.isUserInProject(projectId, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const members = await projectModel.getMembersOfProject(projectId);

    return members;
  } catch (err) {
    throw err;
  }
};

const removeMembersFromProject = async (projectId, userIds, actorId) => {
  try {
    const isProjectMember = await projectModel.isUserInProject(projectId, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const role = await projectModel.getProjectRoleOfUser(projectId, actorId);

    if (role !== "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can delete members from project");
    }

    if (userIds.includes(actorId)) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Owner can not delete self");
    }

    const conversation = await conversationModel.getOneConversationByProjectId(projectId);
    await conversationModel.removeParticipantsFromConversation(conversation.id, userIds);

    await projectModel.removeMembersFromProject(projectId, userIds);

    const actor = await userModel.getOneUserById(actorId);
    for (const userId of userIds) {
      const user = await userModel.getOneUserById(userId);
      await notifyMembersOfProject(
        projectId,
        `<@${user.full_name}> was removed from the project by <@${actor.full_name}>.`
      );
    }

    return projectId;
  } catch (err) {
    throw err;
  }
};

const updateProjectRoleOfUser = async (projectId, updateData, actorId) => {
  try {
    const isProjectMember = await projectModel.isUserInProject(projectId, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const role = await projectModel.getProjectRoleOfUser(projectId, actorId);

    if (role !== "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can update project member's role");
    }

    if (actorId === updateData.user_id) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Owner can not update self");
    }

    await projectModel.updateProjectRoleOfUser(projectId, updateData.user_id, updateData.role);

    const actor = await userModel.getOneUserById(actorId);
    const user = await userModel.getOneUserById(updateData.user_id);
    await notifyMembersOfProject(
      projectId,
      `Role of <@${user.full_name}> in the project has been changed by <@${actor.full_name}>.`
    );

    return projectId;
  } catch (err) {
    throw err;
  }
};

const notifyMembersOfProject = async (projectId, content) => {
  try {
    const project = await projectModel.getOneProjectById(projectId);
    const projectMembers = await projectModel.getMembersOfProject(projectId);

    for (const member of projectMembers) {
      const notificationId = await notificationModel.createOneNotification({
        user_id: member.id,
        title: project.name,
        content,
        reference_type: "project",
        reference_id: projectId
      });
      const notification = await notificationModel.getOneNotificationById(notificationId);

      emitNewNotification(member.id, notification);
    }
  } catch (err) {
    throw err;
  }
};

export default {
  createOneProject,
  getManyProjectsByTeamId,
  updateOneProjectById,
  deleteOneProjectById,
  addMembersToProject,
  getMembersOfProject,
  removeMembersFromProject,
  updateProjectRoleOfUser
};
