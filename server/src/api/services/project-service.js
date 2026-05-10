import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/api-error.js';
import projectModel from '../models/project-model.js';

const createProject = async (teamId, userId, name, description) => {
    try {
        const project = await projectModel.createProject(teamId, userId, name, description);

        if(!project.id) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to create a project"
            );
        }

        return project;
    } catch (err) {
        throw err;
    }
}

const ensureUserInProject = async(projectId, userId) => {
    const exists = await projectModel.ensureUserInProject(projectId, userId);

    if (!exists) {
        throw new ApiError(
            StatusCodes.NOT_FOUND, 
            "User is not a member of this project"
        );
    }
}

const addUserToProject = async(projectId, userId) => {
    try {
        const member = await projectModel.addUserToProject(projectId, userId);

        if(!member) {
            throw new ApiError (
                StatusCodes.CONFLICT,
                "The user is already a member of the project"
            )
        }

        return member;
    } catch (err) {
        throw err;
    }
}

const deleteUserFromProject = async(projectId, userId) => {
    try {
        await ensureUserInProject(projectId, userId);
    
        const deleted = await projectModel.deleteUserFromProject(projectId, userId);
      
        if (!deleted) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR, 
                "Failed to delete user from project"
            );
        }
      
        return deleted;
    } catch (err) {
        throw err;
    }
}

const updateUserProjectRole = async(projectId, userId, role) => {
    try {
        await ensureUserInProject(projectId, userId);

        const updated = await projectModel.updateUserProjectRole(projectId, userId, role);

        if(!updated) {
            throw new ApiError (
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to update user role"
            )
        }

        return updated;
    } catch (err) {
        throw err;
    }
}

export default {
    createProject,
    ensureUserInProject,
    addUserToProject,
    deleteUserFromProject,
    updateUserProjectRole
}