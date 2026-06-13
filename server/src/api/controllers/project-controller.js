import { StatusCodes } from "http-status-codes";

import projectService from "../services/project-service.js";

const createOneProject = async (req, res, next) => {
  try {
    const project = await projectService.createOneProject(req.body, req.user.id);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

const getProjectsOfUserInTeam = async (req, res, next) => {
  try {
    const projects = await projectService.getManyProjectsByTeamId(req.query.team_id, req.user.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: { projects }
    });
  } catch (error) {
    next(error);
  }
};

const updateOneProjectById = async (req, res, next) => {
  try {
    const projectId = await projectService.updateOneProjectById(
      req.params.id,
      req.body,
      req.user.id
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Updated successfully project with id ${projectId}`
    });
  } catch (error) {
    next(error);
  }
};

const deleteOneProjectById = async (req, res, next) => {
  try {
    const projectId = await projectService.deleteOneProjectById(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Deleted successfully project with id ${projectId}`
    });
  } catch (error) {
    next(error);
  }
};

const addMembersToProject = async (req, res, next) => {
  try {
    const projectId = await projectService.addMembersToProject(
      req.params.id,
      req.body.user_ids,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Added members successfully to project ${projectId}`
    });
  } catch (error) {
    next(error);
  }
};

const getMembersOfProject = async (req, res, next) => {
  try {
    const members = await projectService.getMembersOfProject(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { members }
    });
  } catch (error) {
    next(error);
  }
};

const removeMembersFromProject = async (req, res, next) => {
  try {
    const projectId = await projectService.removeMembersFromProject(
      req.params.id,
      req.body.user_ids,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Deleted members successfully from project ${projectId}`
    });
  } catch (error) {
    next(error);
  }
};

const updateProjectRoleOfMember = async (req, res, next) => {
  try {
    const projectId = await projectService.updateProjectRoleOfUser(
      req.params.id,
      req.body,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Updated successfully role of user ${req.body.user_id} in project ${projectId}`
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createOneProject,
  getProjectsOfUserInTeam,
  updateOneProjectById,
  deleteOneProjectById,
  addMembersToProject,
  getMembersOfProject,
  removeMembersFromProject,
  updateProjectRoleOfMember
};
