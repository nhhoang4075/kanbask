import { StatusCodes } from "http-status-codes";

import projectService from "../services/project-service.js";

const createProject = async (req, res, next) => {
    try {
        const { teamId, userId, name, description } = req.body;

        const project = await projectService.createProject(teamId, userId, name, description);
    
        return res.status(StatusCodes.CREATED).json({
            success: true,
            data: project
        })
    } catch (error) {
        return next(error);
    }
}


const addUserToProject = async(req, res, next) => {
    try {
        const { projectId, userId } = req.params

        const member = await projectService.addUserToProject(projectId, userId);
    
        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            data: member
        })
    } catch (error) {
        return next(error);
    }
}

const deleteUserFromProject = async(req, res, next) => {
    try {
        const { projectId, userId } = req.params;

        const deleted = await projectService.deleteUserFromProject(projectId, userId);

        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            data: deleted
        })
    } catch (error) {
        return next(error);
    }
}

const updateUserProjectRole = async ({req, res, next}) => {
    try {
        const { projectId, userId } = req.params;
        const { role } = req.body;

        if(!role) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Missing role to update");
        }

        const updated = await projectService.updateUserProjectRole(projectId, userId, role);
        
        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            data: updated
        })
    } catch (error) {
        return next(error);
    }
}

export default {
    createProject,
    addUserToProject,
    deleteUserFromProject,
    updateUserProjectRole
}