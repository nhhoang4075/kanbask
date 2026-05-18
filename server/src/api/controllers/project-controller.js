import { StatusCodes } from "http-status-codes";

import projectService from "../services/project-service.js";

const createProject = async (req, res, next) => {
  try {
    const { team_id, name, description } = req.body;
    const user_id = req.user.id;

    const project = await projectService.createProject(team_id, user_id, name, description);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: project
    });
  } catch (error) {
    return next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { project_id } = req.params;

    const project = await projectService.getProjectInfoById(project_id);
    const members = await projectService.getProjectMembersById(project_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        project,
        members
      }
    });
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const { name, description } = req.body;

    await projectService.updateProject(project_id, name, description);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Update name and description for project ${project_id} successfully`
    });
  } catch (error) {
    return next(error);
  }
};

const addUserToProject = async (req, res, next) => {
  try {
    const { project_id, user_id } = req.params;

    await projectService.addUserToProject(project_id, user_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Add user ${user_id} to project ${project_id} successfully`
    });
  } catch (error) {
    return next(error);
  }
};

const deleteUserFromProject = async (req, res, next) => {
  try {
    const { project_id, user_id } = req.params;

    await projectService.deleteUserFromProject(project_id, user_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Delete user ${user_id} from project ${project_id} successfully`
    });
  } catch (error) {
    return next(error);
  }
};

const updateUserProjectRole = async (req, res, next) => {
  try {
    const { project_id, user_id } = req.params;
    const { role } = req.body;

    if (!role) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing role to update");
    }

    await projectService.updateUserProjectRole(project_id, user_id, role);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Update user ${user_id} 's role to ${role} in project ${project_id}`
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  createProject,
  getProjectById,
  updateProject,
  addUserToProject,
  deleteUserFromProject,
  updateUserProjectRole
};
