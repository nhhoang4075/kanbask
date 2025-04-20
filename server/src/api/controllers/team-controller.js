import { StatusCodes } from "http-status-codes";
import teamService from "../services/team-service.js";


const createOneTeam = async (req, res, next) => {
  try {
    const { name, code, description, userId } = req.body;


    const teamId = await teamService.createOneTeam({
      name,
      code,
      description,
      userId
    });


    return res.status(StatusCodes.CREATED).json({
      success: true,
      messsage: "Team created successfully"
    });
  } catch (error) {
    console.error("Error creating team:", error);
    return next(error);
  }
};


const addMembersToTeam = async (req, res, next) => {
  try {
    const { teamId, userIds } = req.body;
    const members = await teamService.addMembersToTeam(teamId, userIds);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Members added successfully" });
  } catch (error) {
    return next(error);
  }
};


const deleteMembersFromTeam = async (req, res, next) => {
  try {
    const { teamId, userIds, deleterId } = req.body;


    const deletedMemberIds = await teamService.deleteMembersFromTeam(teamId, userIds, deleterId);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Members deleted successfully" });
  } catch (error) {
    return next(error);
  }
};


const getTeamsByUserId = async (req, res, next) => {
  try {
    const teams = await teamService.getTeamsByUserId(req.params.userId);
    return res.status(StatusCodes.OK).json({ success: true, data: { teams } });
  } catch (error) {
    return next(error);
  }
};


const getMembersByTeamId = async (req, res, next) => {
  try {
    const { members, membersCount } = await teamService.getMembersByTeamId(req.params.teamId);
    return res.status(StatusCodes.OK).json({ success: true, data: { members, membersCount } });
  } catch (error) {
    return next(error);
  }
};


const deleteTeam = async (req, res, next) => {
  try {
    const { teamId, deleterId } = req.body;
    const deletedteamID = await teamService.deleteTeam(teamId, deleterId);
    return res.status(StatusCodes.OK).json({ success: true, message: "Team deleted successfully" });
  } catch (error) {
    return next(error);
  }
};


const addAdmin = async (req, res, next) => {
  try {
    const { teamId, userIds, adderId } = req.body;
    const newadmin = await teamService.addAdmin(teamId, userIds, adderId);
    return res.status(StatusCodes.OK).json({ success: true, message: "Admin added successfully" });
  } catch (error) {
    return next(error);
  }
};


export default {
  createOneTeam,
  deleteTeam,
  addAdmin,
  addMembersToTeam,
  deleteMembersFromTeam,
  getTeamsByUserId,
  getMembersByTeamId
};
