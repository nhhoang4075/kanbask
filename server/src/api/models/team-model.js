import { db } from "../../config/db.js";


const createOneTeam = async (name, code, description) => {
  try {
    const [team] = await db("teams")
      .insert({
        name,
        code,
        description
      })
      .returning("id");


    return team.id;
  } catch (err) {
    throw new Error(err);
  }
};


const addMembersToTeam = async (teamId, userIds, role) => {
  const memberIds = [];
  try {
    for (const userId of userIds) {
      const [member] = await db("user_team")
        .insert({
          user_id: userId,
          team_id: teamId,
          role: role
        })
        .returning("user_id");


      memberIds.push(member.id);
    }
    return memberIds;
  } catch (err) {
    throw new Error(err);
  }
};


const deleteMembersFromTeam = async (teamId, userIds) => {
  try {
    const deletedMembers = await db("user_team")
      .whereIn("user_id", userIds)
      .andWhere("team_id", teamId)
      .del()
      .returning("user_id");


    return deletedMembers.map((member) => member.id);
  } catch (err) {
    throw new Error("Error deleting members from team: " + err.message);
  }
};


const getTeamsByUserId = async (userId) => {
  try {
    const teamIds = await db("user_team").where("user_team.user_id", userId).select("team_id");


    return teamIds.map((team) => team.team_id);
  } catch (err) {
    throw new Error(err);
  }
};


const getMembersByTeamId = async (teamId) => {
  try {
    const memberIds = await db("user_team").where("user_team.team_id", teamId).select("user_id");


    return memberIds.map((member) => member.user_id);
  } catch (err) {
    throw new Error(err);
  }
};


const getRole = async (userId, teamId) => {
  try {
    const [result] = await db("user_team")
      .where({ user_id: userId, team_id: teamId })
      .select("role");


    return result?.role;
  } catch (err) {
    throw new Error(err);
  }
};


const deleteTeam = async (teamId) => {
  try {
    const [deleted] = await db("teams").where({ id: teamId }).del().returning("id");


    return deleted?.id;
  } catch (err) {
    throw new Error(err);
  }
};


const addAdmin = async (teamId, userIds) => {
  try {
    const updates = await Promise.all(
      userIds.map((userId) =>
        db("user_team")
          .where({ user_id: userId, team_id: teamId })
          .update({ role: "admin" })
          .returning("user_id")
      )
    );


    return updates.map(([row]) => row.id);
  } catch (err) {
    throw new Error(err);
  }
};


const getUsersByIds = async (userIds) => {
  try {
    const users = await db("users")
      .whereIn("id", userIds) // Tìm nhiều người dùng theo danh sách id
      .select("*");
    return users;
  } catch (err) {
    throw new Error(err);
  }
};


const getTeamsByIds = async (teamIds) => {
  try {
    const teams = await db("teams")
      .whereIn("id", teamIds) // Tìm nhiều nhóm theo danh sách id
      .select("*");
    return teams;
  } catch (err) {
    throw new Error(err);
  }
};


export default {
  createOneTeam,
  getTeamsByIds,
  getUsersByIds,
  addMembersToTeam,
  deleteMembersFromTeam,
  getTeamsByUserId,
  getMembersByTeamId,
  getRole,
  deleteTeam,
  addAdmin
};
