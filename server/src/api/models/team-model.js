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
    const teams = await db("teams AS t")
      .join("team_members AS tm", "tm.team_id", "=", "t.id")
      .select(
        "t.*",
        "tm.role",
        "tm.joined_at",
        db.raw(`
          (
            SELECT COUNT(*)
            FROM team_members tm2
            WHERE tm2.team_id = t.id
          )::int AS member_count
        `)
      )
      .where("tm.user_id", user_id)
      .orderBy("tm.joined_at", "asc");

    return teams;
  } catch (err) {
    throw new Error(err);
  }
};

const isUserInTeam = async (team_id, user_id) => {
  const [record] = await db("team_members").where({ team_id, user_id }).limit(1);

  return !!record;
};

const updateOneTeamById = async (id, data) => {
  try {
    const [team] = await db("teams")
      .update({ ...data, updated_at: db.fn.now() })
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
        await trx("team_members")
          .insert({
            team_id,
            user_id,
            joined_at: db.fn.now()
          })
          .onConflict(["user_id", "team_id"])
          .ignore();
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
      .join("user_public_view AS v", "v.id", "=", "tm.user_id")
      .select("v.*", "tm.role", "tm.joined_at")
      .where({ team_id });

    return members;
  } catch (err) {
    throw new Error(err);
  }
};

const removeMembersFromTeam = async (team_id, user_ids) => {
  try {
    await db("team_members")
      .delete()
      .whereIn("user_id", user_ids)
      .andWhere("team_id", team_id)
      .returning("user_id");

    return team_id;
  } catch (err) {
    throw new Error(err);
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

const createOneTeamJoinRequest = async (team_id, user_id) => {
  try {
    const [request] = await db("team_join_requests").insert({ team_id, user_id }).returning("id");

    return request.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneTeamJoinRequestById = async (id) => {
  try {
    const [request] = await db("team_join_requests").select("*").where({ id }).limit(1);

    return request;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyTeamJoinRequestsOfTeam = async (team_id) => {
  try {
    const requests = await db("team_join_requests AS tjr")
      .join("user_public_view AS v", "v.id", "=", "tjr.user_id")
      .select(
        "tjr.*",
        "v.full_name AS requester_full_name",
        "v.email AS requester_email",
        "v.avatar_url AS requester_avatar_url"
      )
      .where({ team_id });

    return requests;
  } catch (err) {
    throw new Error(err);
  }
};

const isTeamJoinRequestPending = async (team_id, user_id) => {
  try {
    const record = await db("team_join_requests")
      .where({ team_id, user_id, status: "pending" })
      .first("id");

    return !!record;
  } catch (err) {
    throw new Error(err);
  }
};

const updateTeamJoinRequestStatus = async (request_id, status) => {
  try {
    const [request] = await db("team_join_requests")
      .update({ status, updated_at: db.fn.now() })
      .where({ id: request_id })
      .returning("id");

    return request.id;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneTeam,
  getOneTeamById,
  getOneTeamByCode,
  getManyTeamsByUserId,
  isUserInTeam,
  updateOneTeamById,
  deleteOneTeamById,
  addMembersToTeam,
  getMembersOfTeam,
  removeMembersFromTeam,
  getTeamRoleOfUser,
  updateTeamRoleOfUser,
  createOneTeamJoinRequest,
  getOneTeamJoinRequestById,
  getManyTeamJoinRequestsOfTeam,
  isTeamJoinRequestPending,
  updateTeamJoinRequestStatus
};
