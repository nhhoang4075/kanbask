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

const getTeamsOfUser = async (req, res, next) => {
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

const removeMembersFromTeam = async (req, res, next) => {
  try {
    const teamId = await teamService.removeMembersFromTeam(
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

const updateTeamRoleOfMember = async (req, res, next) => {
  try {
    const teamId = await teamService.updateTeamRoleOfUser(req.params.id, req.body, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Updated successfully role of user ${req.body.user_id} in team ${teamId}`
    });
  } catch (error) {
    next(error);
  }
};

const joinOneTeamByCode = async (req, res, next) => {
  try {
    const teamId = await teamService.joinOneTeamByCode(req.query.code, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Requested to join team ${teamId} successfully`
    });
  } catch (error) {
    next(error);
  }
};

const leaveOneTeamById = async (req, res, next) => {
  try {
    const teamId = await teamService.leaveOneTeamById(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Leaved join team ${teamId} successfully`
    });
  } catch (error) {
    next(error);
  }
};

const getManyTeamJoinRequestsOfTeam = async (req, res, next) => {
  try {
    const requests = await teamService.getManyTeamJoinRequestsOfTeam(
      req.query.team_id,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: { requests }
    });
  } catch (error) {
    next(error);
  }
};

const approveTeamJoinRequest = async (req, res, next) => {
  try {
    await teamService.approveTeamJoinRequest(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Aprroved team join request successfully`
    });
  } catch (error) {
    next(error);
  }
};

const rejectTeamJoinRequest = async (req, res, next) => {
  try {
    await teamService.rejectTeamJoinRequest(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Rejected team join request successfully`
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createOneTeam,
  getTeamsOfUser,
  updateOneTeamById,
  deleteOneTeamById,
  getMembersOfTeam,
  removeMembersFromTeam,
  updateTeamRoleOfMember,
  joinOneTeamByCode,
  leaveOneTeamById,
  getManyTeamJoinRequestsOfTeam,
  approveTeamJoinRequest,
  rejectTeamJoinRequest
};
