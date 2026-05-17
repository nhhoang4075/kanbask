import teamModel from "../models/team-model.js";


const createOneTeam = async ({ name, code, description, userId }) => {
  try {
    const teamId = await teamModel.createOneTeam(name, code, description);
    if (!teamId || teamId.length === 0) {
      throw new Error("Failed to create team");
    }


    const newMemberIds = await teamModel.addMembersToTeam(teamId, [userId], "owner");
    if (!newMemberIds || newMemberIds.length === 0) {
      throw new Error("Failed to create team");
    }
    return { teamId };
  } catch (error) {
    throw new Error(error.message);
  }
};


const addMembersToTeam = async (teamId, userIds) => {
  try {
    const memberIds = await teamModel.addMembersToTeam(teamId, userIds, "member");
    if (!memberIds || memberIds.length === 0) {
      throw new Error(`Failed to add member to team.`);
    }

    return userIds;
  } catch (error) {
    throw new Error(error.message);
  }
};


const deleteMembersFromTeam = async (teamId, userIds, deleterID) => {
  try {
    const role = await teamModel.getRole(deleterID, teamId);
    if (role != "owner" && role != "admin") {
      throw new Error("Only owner can delete members from team ");
    }
    const memberIds = await teamModel.deleteMembersFromTeam(teamId, userIds);
    if (!memberIds || memberIds.length === 0) {
      throw new Error("Failed to delete members from team.");
    }


    return userIds;
  } catch (error) {
    throw new Error(error.message);
  }
};


const getTeamsByUserId = async (userId) => {
  try {
    const teamIds = await teamModel.getTeamsByUserId(userId);


    if (!teamIds || teamIds.length === 0) {
      throw new Error("No teams found for this user.");
    }


    const teams = await teamModel.getTeamsByIds(teamIds);
    return teams.map((teams) => teams.name);
  } catch (error) {
    throw new Error(error.message);
  }
};


const getMembersByTeamId = async (teamId) => {
  try {
    const memberIds = await teamModel.getMembersByTeamId(teamId);


    if (!memberIds || memberIds.length === 0) {
      throw new Error("No members found for this team.");
    }


    const members = await teamModel.getUsersByIds(memberIds);
    return { members, membersCount: members.length };
  } catch (error) {
    throw new Error(error.message);
  }
};


const deleteTeam = async (teamId, deleterId) => {
  try {
    const role = await teamModel.getRole(deleterId, teamId);
    if (role != "owner" && role != "admin") {
      throw new Error("Only owner can delete team");
    }


    const memberIds = await teamModel.getMembersByTeamId(teamId);
    if (!memberIds || memberIds.length === 0) {
      throw new Error("No members found for this team.");
    }


    const deletedMemberIds = await teamModel.deleteMembersFromTeam(
      teamId,
      memberIds
    );
    if (!deletedMemberIds || deletedMemberIds.length === 0) {
      throw new Error("Failed to delete members from team.");
    }


    const deleteTeamId = await teamModel.deleteTeam(teamId);
    if (!deleteTeamId) {
      throw new Error("Failed to delete team.");
    }
    return deleteTeamId;
  } catch (error) {
    throw new Error(error.message);
  }
};


const addAdmin = async (teamId, userIds, adderId) => {
  try {
    const checkRole = await teamModel.getRole(adderId, teamId);
    if (checkRole != "owner") {
      throw new Error("Only owner can add admin to team");
    }


    const newAdminIds = await teamModel.addAdmin(teamId, userIds);
    if (!newAdminIds || newAdminIds.length === 0) {
      throw new Error("Failed to add admin to team.");
    }


    return userIds;
  } catch (error) {
    throw new Error(error.message);
  }
};


export default {
  createOneTeam,
  addAdmin,
  deleteTeam,
  addMembersToTeam,
  deleteMembersFromTeam,
  getTeamsByUserId,
  getMembersByTeamId
};
