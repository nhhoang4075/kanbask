import { db } from "../../config/db.js";

const createOneTeam = async (data) => {
  try {
    const [team] = await db("teams")
      .insert({ ...data })
      .returning("id");

    return team.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneTeamById = async (id) => {
  try {
    const [team] = await db("teams").select("*").where({ id }).limit(1);

    return team;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneTeamByCode = async (code) => {
  try {
    const [team] = await db("teams").select("*").where({ code }).limit(1);

    return team;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyTeamsByUserId = async (user_id) => {
  try {
    const teamIds = await db("team_members AS tm")
      .join("teams AS t", "t.id", "=", "tm.team_id")
      .select("t.*", "tm.role")
      .where("tm.user_id", user_id);

    return teamIds.map((team) => team.team_id);
  } catch (err) {
    throw new Error(err);
  }
};

const updateOneTeamById = async (id, data) => {
  try {
    const [team] = await db("teams")
      .update({ ...data, updated_at: new Date().toISOString() })
      .where({ id })
      .returning("id");

    return team.id;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneTeamById = async (id) => {
  try {
    const [team] = await db("teams").delete().where({ id }).returning("id");

    return team.id;
  } catch (err) {
    throw new Error(err);
  }
};

const addMembersToTeam = async (team_id, user_ids) => {
  try {
    await db.transaction(async (trx) => {
      for (const user_id of user_ids) {
        await trx("team_members").insert({
          team_id,
          user_id
        });
      }
    });

    return team_id;
  } catch (err) {
    throw new Error(err);
  }
};

const getMembersOfTeam = async (team_id) => {
  try {
    const members = await db("team_members AS tm")
      .join("users_public_view AS v", "v.id", "=", "tm.user_id")
      .select("v.*", "tm.role")
      .where({ team_id });

    return members;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteMembersFromTeam = async (team_id, user_ids) => {
  try {
    await db("team_members")
      .delete()
      .whereIn("user_id", user_ids)
      .andWhere("team_id", team_id)
      .returning("user_id");

    return team_id;
  } catch (err) {
    throw new Error("Error deleting members from team: " + err.message);
  }
};

const getTeamRoleOfUser = async (team_id, user_id) => {
  try {
    const [user] = await db("team_members").select("role").where({ team_id, user_id });

    return user.role;
  } catch (err) {
    throw new Error(err);
  }
};

const updateTeamRoleOfUser = async (team_id, user_id, role) => {
  try {
    await db("team_members").update({ role }).where({ team_id, user_id });

    return user_id;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneTeam,
  getOneTeamById,
  getOneTeamByCode,
  getManyTeamsByUserId,
  updateOneTeamById,
  deleteOneTeamById,
  addMembersToTeam,
  getMembersOfTeam,
  deleteMembersFromTeam,
  getTeamRoleOfUser,
  updateTeamRoleOfUser
};
