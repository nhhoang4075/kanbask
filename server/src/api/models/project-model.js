// import { sql } from "../../config/db.js";

// const createProject = async (teamId, createdBy, name, description) => {
//     try {
//         const [project] = await sql`
//             INSERT INTO projects (team_id, name, description, created_by)
//             VALUES (${teamId}, ${name}, ${description}, ${createdBy})
//             RETURNING *
//         `
//         return project;
//     } catch (err) {
//         throw new Error(err);
//     }

// }

// const ensureUserInProject = async (project_id, user_id) => {
//     try {
//         const result = await db.sql`
//           SELECT 1 FROM project_members
//           WHERE project_id = ${project_id} AND user_id = ${user_id}
//         `;
//         return result.length > 0;
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// const addUserToProject = async (project_id, user_id) => {
//     try {
//         const [member] = await sql`
//             INSERT INTO project_members (project_id, user_id, role)
//             values (${project_id}, ${user_id}, 'member'})
//             ON CONFLICT (project_id, user_id) DO NOTHING
//             RETURNING *;
//         `;
//         return member;
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// const deleteUserFromProject = async (project_id, user_id) => {
//     try {
//         const [deleted] = await sql`
//             DELETE FROM project_members
//             WHERE project_id = ${project_id} AND user_id = ${user_id}
//             RETURNING *;
//         `
//         return deleted;
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// const updateUserProjectRole = async (project_id, user_id, role) => {
//     try {
//         const [updated] = await db.sql`
//           UPDATE project_members
//           SET role = ${role}
//           WHERE project_id = ${project_id} AND user_id = ${user_id}
//           RETURNING *;
//         `;
//         return updated;
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export default {
//     createProject,
//     ensureUserInProject,
//     addUserToProject,
//     deleteUserFromProject,
//     updateUserProjectRole
// }

// filepath: /home/minh47857/Workspace/computer_science_hust/intro_se/kanbask/server/src/api/models/project-model.js
import db from "../../config/db.js";

const createProject = async (team_id, user_id, name, description) => {
  try {
    const [project] = await db("projects")
      .insert({
        team_id,
        name,
        description,
        created_by: user_id
      })
      .returning("*");
    return project;
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
  getUserProjectRole,
  ensureUserInProject,
  addUserToProject,
  deleteUserFromProject,
  updateUserProjectRole
};
