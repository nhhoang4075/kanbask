import { StatusCodes } from "http-status-codes";

import teamModel from "../models/team-model.js";
import userModel from "../models/user-model.js";
import projectModel from "../models/project-model.js";
import conversationModel from "../models/conversation-model.js";
import notificationModel from "../models/notification-model.js";
import ApiError from "../../utils/api-error.js";
import { emitNewNotification } from "../../socket/notification-socket.js";
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

    const conversationId = await conversationModel.createOneConversation({
      type: "team",
      team_id: teamId
    });
    await conversationModel.addParticipantsToConversation(conversationId, [actorId]);

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
      const requests = await teamModel.getManyTeamJoinRequestsOfTeam(teamId);

      const pendingRequest = requests.filter((t) => t.status === "pending");

      await Promise.all(
        pendingRequest.map(
          async (r) => await teamModel.updateTeamJoinRequestStatus(r.id, "rejected")
        )
      );
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

    const conversation = await conversationModel.getOneConversationByTeamId(teamId);
    await conversationModel.deleteOneConversationById(conversation.id);

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

    // Get all projects in the team
    const projects = await projectModel.getManyProjectsByTeamId(teamId, actorId);

    // Remove members from all projects in the team
    for (const project of projects) {
      const projectConversation = await conversationModel.getOneConversationByProjectId(project.id);

      await conversationModel.removeParticipantsFromConversation(projectConversation.id, userIds);
      await projectModel.removeMembersFromProject(project.id, userIds);
    }

    const conversation = await conversationModel.getOneConversationByTeamId(teamId);
    await conversationModel.removeParticipantsFromConversation(conversation.id, userIds);

    await teamModel.removeMembersFromTeam(teamId, userIds);

    const actor = await userModel.getOneUserById(actorId);
    for (const userId of userIds) {
      const user = await userModel.getOneUserById(userId);
      await notifyMembersOfTeam(
        teamId,
        `<@${user.full_name}> was removed from the team by <@${actor.full_name}>.`
      );
    }

    return teamId;
  } catch (err) {
    throw err;
  }
};

const updateTeamRoleOfUser = async (teamId, updateData, actorId) => {
  try {
    const isTeamMember = await teamModel.isUserInTeam(teamId, actorId);

    if (!isTeamMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of team can access this");
    }

    const role = await teamModel.getTeamRoleOfUser(teamId, actorId);

    if (role !== "owner") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only owner can update team member's role");
    }

    if (actorId === updateData.user_id) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Owner can not update self");
    }

    await teamModel.updateTeamRoleOfUser(teamId, updateData.user_id, updateData.role);

    const actor = await userModel.getOneUserById(actorId);
    const user = await userModel.getOneUserById(updateData.user_id);
    await notifyMembersOfTeam(
      teamId,
      `Role of <@${user.full_name}> in the team has been changed by <@${actor.full_name}>.`
    );

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

    const user = await userModel.getOneUserById(actorId);

    if (team.join_policy === "auto") {
      await teamModel.addMembersToTeam(team.id, [actorId]);

      const conversation = await conversationModel.getOneConversationByTeamId(team.id);
      await conversationModel.addParticipantsToConversation(conversation.id, [actorId]);

      await notifyMembersOfTeam(team.id, `<@${user.full_name}> has joined the team.`);
    } else {
      const isRequestPending = await teamModel.isTeamJoinRequestPending(team.id, actorId);

      if (!isRequestPending) {
        await teamModel.createOneTeamJoinRequest(team.id, actorId);

        await notifyMembersOfTeam(team.id, `<@${user.full_name}> has requested to join the team.`);
      }
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

    // Get all projects in the team
    const projects = await projectModel.getManyProjectsByTeamId(teamId, actorId);

    // Leave all projects in the team
    for (const project of projects) {
      const projectConversation = await conversationModel.getOneConversationByProjectId(project.id);

      await conversationModel.removeParticipantsFromConversation(projectConversation.id, [actorId]);
      await projectModel.removeMembersFromProject(project.id, [actorId]);
    }

    const conversation = await conversationModel.getOneConversationByTeamId(teamId);
    await conversationModel.removeParticipantsFromConversation(conversation.id, [actorId]);

    await teamModel.removeMembersFromTeam(teamId, [actorId]);

    const user = await userModel.getOneUserById(actorId);
    await notifyMembersOfTeam(teamId, `<@${user.full_name}> has left the team.`);

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

    const conversation = await conversationModel.getOneConversationByTeamId(request.team_id);
    await conversationModel.addParticipantsToConversation(conversation.id, [request.user_id]);

    const actor = await userModel.getOneUserById(actorId);
    const user = await userModel.getOneUserById(request.user_id);
    await notifyMembersOfTeam(
      request.team_id,
      `Request to join the team of <@${user.full_name}> was approved by <@${actor.full_name}>.`
    );

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

    const actor = await userModel.getOneUserById(actorId);
    const user = await userModel.getOneUserById(request.user_id);
    await notifyMembersOfTeam(
      request.team_id,
      `Request to join the team of <@${user.full_name}> was rejected by <@${actor.full_name}>.`
    );

    return request.team_id;
  } catch (err) {
    throw err;
  }
};

const notifyMembersOfTeam = async (teamId, content) => {
  try {
    const team = await teamModel.getOneTeamById(teamId);
    const teamMembers = await teamModel.getMembersOfTeam(teamId);

    for (const member of teamMembers) {
      const notificationId = await notificationModel.createOneNotification({
        user_id: member.id,
        title: team.name,
        content,
        reference_type: "team",
        reference_id: teamId
      });
      const notification = await notificationModel.getOneNotificationById(notificationId);

      emitNewNotification(member.id, notification);
    }
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
