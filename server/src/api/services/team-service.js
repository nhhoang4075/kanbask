import { StatusCodes } from "http-status-codes";

import teamModel from "../models/team-model.js";
import ApiError from "../../utils/api-error.js";
import { sanitizeAllowedFields, generateTeamCode } from "../../utils/helper.js";

const createOneTeam = async (data, createrId) => {
  try {
    const { name, description, join_policy } = data;

    let code;
    const maxRetries = 5;

    for (let attempt = 0; attempt < 5; attempt++) {
      const generatedCode = generateTeamCode(length);
      const exists = await teamModel.getOneTeamByCode(code);

      if (!exists) {
        code = generatedCode;
        break;
      } else if (attempt === maxRetries - 1) {
        throw new ApiError(StatusCodes.CONFLICT, "Failed to generate team code");
      }
    }

    const teamId = await teamModel.createOneTeam({ name, description, join_policy, code });

    if (!teamId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create the team");
    }

    await teamModel.updateTeamRoleOfUser(teamId, createrId, "owner");

    const team = teamModel.getOneTeamById(teamId);

    return team;
  } catch (err) {
    throw err;
  }
};

const getManyTeamsByUserId = async (userId) => {
  try {
    const teams = await teamModel.getManyTeamsByUserId(userId);

    return teams;
  } catch (err) {
    throw err;
  }
};

const updateOneTeamById = async (teamId, updateData, updaterId) => {
  try {
    const role = await teamModel.getTeamRoleOfUser(teamId, updaterId);

    if (role != "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can update team info");
    }

    const allowedData = sanitizeAllowedFields(data, ["name", "description", "join_policy"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    await teamModel.updateOneTeamById(teamId, updateData);

    return teamId;
  } catch (err) {
    throw err;
  }
};

const deleteOneTeamById = async (teamId, deleterId) => {
  try {
    const role = await teamModel.getTeamRoleOfUser(teamId, deleterId);

    if (role != "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can delete team");
    }

    await teamModel.deleteOneTeamById(teamId);

    return teamId;
  } catch (err) {
    throw err;
  }
};

const addMembersToTeam = async (teamId, userIds) => {
  try {
    await teamModel.addMembersToTeam(teamId, userIds);

    return teamId;
  } catch (err) {
    throw err;
  }
};

const getMembersOfTeam = async (teamId, requesterId) => {
  try {
    const role = await teamModel.getTeamRoleOfUser(requesterId);

    if (!role) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const members = await teamModel.getMembersOfTeam(teamId);

    return members;
  } catch (err) {
    throw err;
  }
};

const deleteMembersFromTeam = async (teamId, userIds, deleterId) => {
  try {
    const role = await teamModel.getTeamRoleOfUser(teamId, deleterId);

    if (role != "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can delete members from team");
    }

    await teamModel.deleteMembersFromTeam(teamId, userIds);

    return teamId;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateTeamRoleOfUser = async (teamId, updateUserData, updaterId) => {
  try {
    const role = await teamModel.getTeamRoleOfUser(teamId, updaterId);

    if (role != "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can update team member's role");
    }

    await teamModel.updateTeamRoleOfUser(teamId, updateUserData.user_id, updateUserData.role);

    return teamId;
  } catch (err) {
    throw err;
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
