import { StatusCodes } from "http-status-codes";

import ApiError from "../../utils/api-err.js";
import projectModel from "../models/project-model.js";
import teamModel from "../models/team-model.js";
import { sanitizeAllowedFields } from "../../utils/helper";

const createOneProject = async (data, actorId) => {
  try {
    const allowedData = sanitizeAllowedFields(data, ["name", "description", "team_id"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
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

    const project = projectModel.getOneProjectById(projectId);

    return project;
  } catch (err) {
    throw err;
  }
};

const getManyProjectsByUserId = async (userId) => {
  try {
    const projects = await projectModel.getManyProjectsByUserId(userId);

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

      if (isTeamMember) {
        sanitizedUserIds.push(userId);
      }
    }

    await projectModel.addMembersToProject(projectId, sanitizedUserIds);

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

    await projectModel.removeMembersFromProject(projectId, userIds);

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

    return projectId;
  } catch (err) {
    throw err;
  }
};

export default {
  createOneProject,
  getManyProjectsByUserId,
  updateOneProjectById,
  deleteOneProjectById,
  addMembersToProject,
  getMembersOfProject,
  removeMembersFromProject,
  updateProjectRoleOfUser
};
