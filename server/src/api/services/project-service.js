import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/api-error.js";
import projectModel from "../models/project-model.js";

const createProject = async (team_id, user_id, name, description) => {
  try {
    const project = await projectModel.createProject(team_id, user_id, name, description);

    if (!project.id) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_errorOR, "Failed to create a project");
    }

    return project;
  } catch (error) {
    throw error;
  }
};

const getProjectInfoById = async (project_id) => {
  try {
    const project = await projectModel.getProjectInfoById(project_id);

    if (!project) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Project ${project_id} not found`);
    }

    return project;
  } catch (error) {
    throw error;
  }
};

const updateProject = async (project_id, name, description) => {
  try {
    await projectModel.updateProject(project_id, name, description);
  } catch (error) {
    throw error;
  }
};

const getProjectMembersById = async (project_id) => {
  try {
    const members = await projectModel.getProjectMembersById(project_id);

    if (!members) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Project ${project_id} not found`);
    }

    return members;
  } catch (error) {
    throw error;
  }
};

const ensureUserInProject = async (project_id, user_id) => {
  try {
    const exists = await projectModel.ensureUserInProject(project_id, user_id);

    if (!exists) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User is not a member of this project");
    }
  } catch (error) {
    throw error;
  }
};

const checkProjectAdmin = async (project_id, user_id) => {
  try {
    const role = await projectModel.getUserProjectRole(project_id, user_id);

    if (role != "owner" && role != "admin") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Access denied. Admins only");
    }
  } catch (error) {
    throw error;
  }
};

const addUserToProject = async (project_id, user_id) => {
  try {
    const exists = await projectModel.ensureUserInProject(project_id, user_id);

    if (exists) {
      throw new ApiError(StatusCodes.CONFLICT, "The user is already a member of the project");
    }

    projectModel.addUserToProject(project_id, user_id);
  } catch (error) {
    throw error;
  }
};

const deleteUserFromProject = async (project_id, user_id) => {
  try {
    await ensureUserInProject(project_id, user_id);

    await projectModel.deleteUserFromProject(project_id, user_id);
  } catch (error) {
    throw error;
  }
};

const updateUserProjectRole = async (project_id, user_id, role) => {
  try {
    await ensureUserInProject(project_id, user_id);

    await projectModel.updateUserProjectRole(project_id, user_id, role);
  } catch (error) {
    throw error;
  }
};

export default {
  createProject,
  getProjectInfoById,
  updateProject,
  getProjectMembersById,
  checkProjectAdmin,
  ensureUserInProject,
  addUserToProject,
  deleteUserFromProject,
  updateUserProjectRole
};
