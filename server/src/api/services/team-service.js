import { StatusCodes } from "http-status-codes";

import teamModel from "../models/team-model.js";
import ApiError from "../../utils/api-error.js";
import { sanitizeAllowedFields, generateTeamCode } from "../../utils/helper.js";

const createOneTeam = async (data, actorId) => {
  try {
    const { name, description, join_policy } = data;

    let code;
    const maxRetries = 5;

    for (let attempt = 0; attempt < 5; attempt++) {
      const generatedCode = generateTeamCode();
      const exists = await teamModel.getOneTeamByCode(generatedCode);

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

    await teamModel.addMembersToTeam(teamId, [actorId]);
    await teamModel.updateTeamRoleOfUser(teamId, actorId, "owner");

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

const updateOneTeamById = async (teamId, updateData, actorId) => {
  try {
    const isTeamMember = await teamModel.isUserInTeam(teamId, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const role = await teamModel.getTeamRoleOfUser(teamId, actorId);

    if (role != "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can update team info");
    }

    const allowedData = sanitizeAllowedFields(updateData, ["name", "description", "join_policy"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    if (allowedData.join_policy && allowedData.join_policy === "auto") {
      await teamModel.updateTeamJoinRequestsOfTeam(teamId, "rejected");
    }

    await teamModel.updateOneTeamById(teamId, allowedData);

    return teamId;
  } catch (err) {
    throw err;
  }
};

const deleteOneTeamById = async (teamId, actorId) => {
  try {
    const isTeamMember = await teamModel.isUserInTeam(teamId, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const role = await teamModel.getTeamRoleOfUser(teamId, actorId);

    if (role != "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can delete team");
    }

    await teamModel.deleteOneTeamById(teamId);

    return teamId;
  } catch (err) {
    throw err;
  }
};

const getMembersOfTeam = async (teamId, actorId) => {
  try {
    const isTeamMember = await teamModel.isUserInTeam(teamId, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const members = await teamModel.getMembersOfTeam(teamId);

    return members;
  } catch (err) {
    throw err;
  }
};

const removeMembersFromTeam = async (teamId, userIds, actorId) => {
  try {
    const isTeamMember = await teamModel.isUserInTeam(teamId, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const role = await teamModel.getTeamRoleOfUser(teamId, actorId);

    if (role !== "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can delete members from team");
    }

    if (userIds.includes(actorId)) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Owner can not delete self");
    }

    await teamModel.removeMembersFromTeam(teamId, userIds);

    return teamId;
  } catch (err) {
    throw err;
  }
};

const updateTeamRoleOfUser = async (teamId, updateUserData, actorId) => {
  try {
    const isTeamMember = await teamModel.isUserInTeam(teamId, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const role = await teamModel.getTeamRoleOfUser(teamId, actorId);

    if (role !== "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can update team member's role");
    }

    if (actorId === updateUserData.user_id) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Owner can not update self");
    }

    await teamModel.updateTeamRoleOfUser(teamId, updateUserData.user_id, updateUserData.role);

    return teamId;
  } catch (err) {
    throw err;
  }
};

const joinOneTeamByCode = async (code, actorId) => {
  try {
    const team = await teamModel.getOneTeamByCode(code);

    if (!team) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid team code");
    }

    const isTeamMember = await teamModel.isUserInTeam(team.id, actorId);

    if (isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You are already member of this team");
    }

    if (team.join_policy === "auto") {
      await teamModel.addMembersToTeam(team.id, [actorId]);
    }

    const isRequestPending = await teamModel.isTeamJoinRequestPending(team.id, actorId);

    if (!isRequestPending) {
      await teamModel.createOneTeamJoinRequest(team.id, actorId);
    }

    return team.id;
  } catch (err) {
    throw err;
  }
};

const leaveOneTeamById = async (teamId, actorId) => {
  try {
    const isTeamMember = await teamModel.isUserInTeam(teamId, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const role = await teamModel.getTeamRoleOfUser(teamId, actorId);

    if (role === "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Owner can not leave team");
    }

    await teamModel.deleteMembersFromTeam(teamId, [actorId]);

    return teamId;
  } catch (err) {
    throw err;
  }
};

const getManyTeamJoinRequestsOfTeam = async (teamId, actorId) => {
  try {
    const isTeamMember = await teamModel.isUserInTeam(teamId, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const requests = await teamModel.getManyTeamJoinRequestsOfTeam(teamId);

    return requests;
  } catch (err) {
    throw err;
  }
};

const approveTeamJoinRequest = async (requestId, actorId) => {
  try {
    const request = await teamModel.getOneTeamJoinRequestById(requestId);

    if (request.status !== "pending") {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Only pending request can be aprroved");
    }

    const isTeamMember = await teamModel.isUserInTeam(request.team_id, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const role = await teamModel.getTeamRoleOfUser(request.team_id, actorId);

    if (role !== "owner" && role !== "admin") {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Only owner or admin can approve team join request"
      );
    }

    await teamModel.updateTeamJoinRequestStatus(requestId, "approved");
    await teamModel.addMembersToTeam(request.team_id, [request.user_id]);

    return request.team_id;
  } catch (err) {
    throw err;
  }
};

const rejectTeamJoinRequest = async (requestId, actorId) => {
  try {
    const request = await teamModel.getOneTeamJoinRequestById(requestId);

    if (request.status !== "pending") {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Only pending request can be rejected");
    }

    const isTeamMember = await teamModel.isUserInTeam(request.team_id, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const role = await teamModel.getTeamRoleOfUser(request.team_id, actorId);

    if (role !== "owner" && role !== "admin") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner or admin can reject team join request");
    }
    await teamModel.updateTeamJoinRequestStatus(requestId, "rejected");

    return request.team_id;
  } catch (err) {
    throw err;
  }
};

export default {
  createOneTeam,
  getManyTeamsByUserId,
  updateOneTeamById,
  deleteOneTeamById,
  getMembersOfTeam,
  removeMembersFromTeam,
  updateTeamRoleOfUser,
  joinOneTeamByCode,
  leaveOneTeamById,
  getManyTeamJoinRequestsOfTeam,
  approveTeamJoinRequest,
  rejectTeamJoinRequest
};
