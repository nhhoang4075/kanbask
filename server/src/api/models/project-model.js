import { db } from "../../config/db.js";

const createProject = async (team_id, user_id, name, description) => {
  try {
    return await db.transaction(async (trx) => {
      const [project] = await trx("projects")
        .insert({
          team_id,
          name,
          description,
          created_by: user_id
        })
        .returning("*");

      await trx("project_members").insert({
        project_id: project.id,
        user_id: user_id,
        role: "owner"
      });

      return project;
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getProjectInfoById = async (project_id) => {
  try {
    const project = await db("projects")
      .where({
        id: project_id
      })
      .first();
    return project;
  } catch (error) {
    throw new Error(error);
  }
};

const updateProject = async (project_id, name, description) => {
  try {
    await db("projects")
      .where({
        id: project_id
      })
      .update({
        name: db.raw("COALESCE(?, name)", [name]),
        description: db.raw("COALESCE(?, description)", [description])
      });
  } catch (error) {
    throw new Error(error);
  }
};

const getProjectMembersById = async (project_id) => {
  try {
    const members = await db("project_members")
      .where({
        project_id
      })
      .select("user_id");
    return members;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserProjectRole = async (project_id, user_id) => {
  try {
    const result = await db("project_members")
      .where({
        project_id,
        user_id
      })
      .select("role")
      .first();
    return result?.role;
  } catch (error) {
    throw new Error(error);
  }
};

const ensureUserInProject = async (project_id, user_id) => {
  try {
    const result = await db("project_members")
      .where({
        project_id,
        user_id
      })
      .first();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const addUserToProject = async (project_id, user_id) => {
  try {
    await db("project_members").insert({
      project_id,
      user_id,
      role: "member"
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUserFromProject = async (project_id, user_id) => {
  try {
    await db("project_members")
      .where({
        project_id,
        user_id
      })
      .delete();
  } catch (error) {
    throw new Error(error);
  }
};

const updateUserProjectRole = async (project_id, user_id, role) => {
  try {
    await db("project_members")
      .where({
        project_id,
        user_id
      })
      .update({ role });
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  createProject,
  getProjectInfoById,
  updateProject,
  getProjectMembersById,
  getUserProjectRole,
  ensureUserInProject,
  addUserToProject,
  deleteUserFromProject,
  updateUserProjectRole
};
