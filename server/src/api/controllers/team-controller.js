import { StatusCodes } from "http-status-codes";
import teamService from "../services/team-service.js";

const createOneTeam = async (req, res, next) => {
  try {
    const team = await teamService.createOneTeam(req.body, req.user.id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: { team }
    });
  } catch (error) {
    next(error);
  }
};

const getManyTeamsByUserId = async (req, res, next) => {
  try {
    const teams = await teamService.getManyTeamsByUserId(req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { teams }
    });
  } catch (error) {
    next(error);
  }
};

const updateOneTeamById = async (req, res, next) => {
  try {
    const teamId = await teamService.updateOneTeamById(req.params.id, req.body, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Updated successfully team with id ${teamId}`
    });
  } catch (error) {
    next(error);
  }
};

const deleteOneTeamById = async (req, res, next) => {
  try {
    const teamId = await teamService.deleteOneTeamById(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Deleted successfully team with id ${teamId}`
    });
  } catch (error) {
    next(error);
  }
};

const addMembersToTeam = async (req, res, next) => {
  try {
    const teamId = await teamService.addMembersToTeam(req.params.id, req.body.user_ids);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Added members successfully to team ${teamId}`
    });
  } catch (error) {
    next(error);
  }
};

const getMembersOfTeam = async (req, res, next) => {
  try {
    const members = await teamService.getMembersOfTeam(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { members }
    });
  } catch (error) {
    next(error);
  }
};

const deleteMembersFromTeam = async (req, res, next) => {
  try {
    const teamId = await teamService.deleteMembersFromTeam(
      req.params.id,
      req.body.user_ids,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Deleted members successfully from team ${teamId}`
    });
  } catch (error) {
    next(error);
  }
};

const updateTeamRoleOfUser = async (req, res, next) => {
  try {
    const teamId = await teamService.updateTeamRoleOfUser(teamId, req.body, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Updated successfully team role of user ${req.body.user_id} in team ${teamId}`
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createOneTeam,
  getManyTeamsByUserId,
  updateOneTeamById,
  deleteOneTeamById,
  addMembersToTeam,
  getMembersOfTeam,
  deleteMembersFromTeam,
  updateTeamRoleOfUser
};
