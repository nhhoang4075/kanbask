import { db } from "../../config/db.js";

const createOneProject = async (data) => {
  try {
    const [project] = await db("projects").insert(data).returning("id");

    return project.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneProjectById = async (id) => {
  try {
    const [project] = await db("projects").select("*").where({ id }).limit(1);

    return project;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyProjectsByTeamId = async (team_id, user_id) => {
  try {
    const projects = await db("projects AS p")
      .join("project_members AS pm", "pm.project_id", "=", "p.id")
      .select(
        "p.*",
        "pm.role",
        "pm.joined_at",
        db.raw(`
          (
            SELECT COUNT(*)
            FROM project_members pm2
            WHERE pm2.project_id = p.id
          )::int AS member_count
        `)
      )
      .where("p.team_id", team_id)
      .andWhere("pm.user_id", user_id)
      .orderBy("pm.joined_at", "asc");

    return projects;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyProjectsByUserId = async (user_id) => {
  try {
    const projects = await db("projects AS p")
      .join("project_members AS pm", "pm.project_id", "=", "p.id")
      .select(
        "p.*",
        "pm.role",
        "pm.joined_at",
        db.raw(`
          (
            SELECT COUNT(*)
            FROM project_members pm2
            WHERE pm2.project_id = p.id
          )::int AS member_count
        `)
      )
      .where("pm.user_id", user_id)
      .orderBy("pm.joined_at", "asc");

    return projects;
  } catch (err) {
    throw new Error(err);
  }
};

const isUserInProject = async (project_id, user_id) => {
  try {
    const [record] = await db("project_members")
      .where({
        project_id,
        user_id
      })
      .limit(1);

    return !!record;
  } catch (err) {
    throw new Error(err);
  }
};

const updateOneProjectById = async (id, data) => {
  try {
    const [project] = await db("projects")
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .where({ id })
      .returning("id");

    return project.id;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneProjectById = async (id) => {
  try {
    const [project] = await db("projects").delete().where({ id }).returning("id");

    return project.id;
  } catch (err) {
    throw new Error(err);
  }
};

const addMembersToProject = async (project_id, user_ids) => {
  try {
    await db.transaction(async (trx) => {
      for (const user_id of user_ids) {
        await db("project_members")
          .insert({
            project_id,
            user_id
          })
          .onConflict(["user_id", "project_id"])
          .ignore();
      }
    });

    return project_id;
  } catch (err) {
    throw new Error(err);
  }
};

const getMembersOfProject = async (project_id) => {
  try {
    const members = await db("project_members AS pm")
      .join("user_public_view AS v", "v.id", "=", "pm.user_id")
      .select("v.*", "pm.role", "pm.joined_at")
      .where({ project_id });

    return members;
  } catch (err) {
    throw new Error(err);
  }
};

const removeMembersFromProject = async (project_id, user_ids) => {
  try {
    await db("project_members").delete().whereIn("user_id", user_ids).andWhere({ project_id });

    return project_id;
  } catch (err) {
    throw new Error(err);
  }
};

const getProjectRoleOfUser = async (project_id, user_id) => {
  try {
    const [user] = await db("project_members")
      .select("role")
      .where({
        project_id,
        user_id
      })
      .limit(1);

    return user.role;
  } catch (err) {
    throw new Error(err);
  }
};

const updateProjectRoleOfUser = async (project_id, user_id, role) => {
  try {
    await db("project_members").update({ role }).where({
      project_id,
      user_id
    });

    return user_id;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneProject,
  getOneProjectById,
  getManyProjectsByTeamId,
  getManyProjectsByUserId,
  isUserInProject,
  updateOneProjectById,
  deleteOneProjectById,
  addMembersToProject,
  getMembersOfProject,
  removeMembersFromProject,
  getProjectRoleOfUser,
  updateProjectRoleOfUser
};
