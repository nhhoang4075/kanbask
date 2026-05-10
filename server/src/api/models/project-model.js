import { sql } from "../../config/db.js";

const createProject = async (teamId, createdBy, name, description) => {
    try {
        const [project] = await sql`
            INSERT INTO projects (team_id, name, description, created_by) 
            VALUES (${teamId}, ${name}, ${description}, ${createdBy})
            RETURNING *
        `
        return project;
    } catch (err) {
        throw new Error(err);
    }

}

const ensureUserInProject = async (projectId, userId) => {
    try {
        const result = await db.sql`
          SELECT 1 FROM project_members
          WHERE project_id = ${projectId} AND user_id = ${userId}
        `;
        return result.length > 0;
    } catch (err) {
        throw new Error(err);
    }
}

const addUserToProject = async (projectId, userId) => {
    try {
        const [member] = await sql`
            INSERT INTO project_members (project_id, user_id, role) 
            values (${projectId}, ${userId}, 'member'})
            ON CONFLICT (project_id, user_id) DO NOTHING
            RETURNING *;
        `;
        return member;
    } catch (err) {
        throw new Error(err);
    }
}

const deleteUserFromProject = async (projectId, userId) => {
    try {
        const [deleted] = await sql`
            DELETE FROM project_members
            WHERE project_id = ${projectId} AND user_id = ${userId}
            RETURNING *;
        `
        return deleted;
    } catch (err) {
        throw new Error(err);
    }
}

const updateUserProjectRole = async (projectId, userId, role) => {
    try {
        const [updated] = await db.sql`
          UPDATE project_members
          SET role = ${role}
          WHERE project_id = ${projectId} AND user_id = ${userId}
          RETURNING *;
        `;
        return updated;
    } catch (err) {
        throw new Error(err);
    }
}

export default {
    createProject,
    ensureUserInProject,
    addUserToProject,
    deleteUserFromProject,
    updateUserProjectRole
}