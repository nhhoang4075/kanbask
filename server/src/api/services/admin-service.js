import os from "os";
import { v4 as uuidv4 } from "uuid";
import { StatusCodes } from "http-status-codes";

import adminModel from "../models/admin-model.js";
import userModel from "../models/user-model.js";
import teamModel from "../models/team-model.js";
import projectModel from "../models/project-model.js";
import taskModel from "../models/task-model.js";
import mailProvider from "../../config/mail-provider.js";
import storageProvider from "../../config/storage-provider.js";
import embeddingProvider from "../../config/embedding-provider.js";
import { getIoInstance } from "../../socket/index.js";
import ApiError from "../../utils/api-error.js";
import { sanitizeUser } from "../../utils/helper.js";

const listUsers = async (q, { limit, offset }) => {
  try {
    const [users, total] = await Promise.all([
      userModel.getManyUsersPaginated(q, { limit, offset }),
      userModel.countUsers(q)
    ]);

    return { users: users.map(sanitizeUser), total };
  } catch (err) {
    throw err;
  }
};

const getUserDetail = async (userId) => {
  try {
    const user = await userModel.getOneUserById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    const [teams, projects] = await Promise.all([
      teamModel.getManyTeamsByUserId(userId),
      projectModel.getManyProjectsByUserId(userId)
    ]);

    return { ...sanitizeUser(user), teams, projects };
  } catch (err) {
    throw err;
  }
};

const updateUserRole = async (userId, role, actorId) => {
  try {
    if (userId === actorId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Admin can not change their own role");
    }

    const user = await userModel.getOneUserById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    await userModel.updateOneUserById(userId, { role });

    return userId;
  } catch (err) {
    throw err;
  }
};

const setUserEnabled = async (userId, isEnabled, actorId) => {
  try {
    if (userId === actorId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Admin can not disable their own account");
    }

    const user = await userModel.getOneUserById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    const updateData = { is_enabled: isEnabled };

    if (!isEnabled) {
      updateData.token_version = user.token_version + 1;
    }

    await userModel.updateOneUserById(userId, updateData);

    return userId;
  } catch (err) {
    throw err;
  }
};

const forceLogoutUser = async (userId) => {
  try {
    const user = await userModel.getOneUserById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    await userModel.updateOneUserById(userId, { token_version: user.token_version + 1 });

    return userId;
  } catch (err) {
    throw err;
  }
};

const resendPasswordReset = async (userId) => {
  try {
    const user = await userModel.getOneUserById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    const code = uuidv4();
    await userModel.updateOneUserById(user.id, {
      password_reset_code: code,
      password_reset_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });

    const passwordResetUrl = `${process.env.CLIENT_ORIGIN}/auth/forgot-password?code=${code}`;

    await mailProvider.sendMail({
      email: user.email,
      subject: "Forgot your password",
      template: "password-reset-mail.ejs",
      data: {
        user: { name: user.full_name },
        passwordResetUrl
      }
    });

    return user.id;
  } catch (err) {
    throw err;
  }
};

const listTeams = async (q, { limit, offset }) => {
  try {
    const [teams, total] = await Promise.all([
      teamModel.getManyTeamsPaginated(q, { limit, offset }),
      teamModel.countTeams(q)
    ]);

    return { teams, total };
  } catch (err) {
    throw err;
  }
};

const getTeamDetail = async (teamId) => {
  try {
    const team = await teamModel.getOneTeamById(teamId);

    if (!team) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No team found");
    }

    const members = await teamModel.getMembersOfTeam(teamId);

    return { ...team, members };
  } catch (err) {
    throw err;
  }
};

const transferTeamOwnership = async (teamId, newOwnerUserId) => {
  try {
    const team = await teamModel.getOneTeamById(teamId);

    if (!team) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No team found");
    }

    const isMember = await teamModel.isUserInTeam(teamId, newOwnerUserId);

    if (!isMember) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Target user is not a member of this team");
    }

    const members = await teamModel.getMembersOfTeam(teamId);
    const currentOwner = members.find((member) => member.role === "owner");

    if (currentOwner && currentOwner.id === newOwnerUserId) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "This user is already the team owner");
    }

    if (currentOwner) {
      await teamModel.updateTeamRoleOfUser(teamId, currentOwner.id, "admin");
    }

    await teamModel.updateTeamRoleOfUser(teamId, newOwnerUserId, "owner");

    return teamId;
  } catch (err) {
    throw err;
  }
};

const listProjects = async (q, { limit, offset }) => {
  try {
    const [projects, total] = await Promise.all([
      projectModel.getManyProjectsPaginated(q, { limit, offset }),
      projectModel.countProjects(q)
    ]);

    return { projects, total };
  } catch (err) {
    throw err;
  }
};

const getProjectDetail = async (projectId) => {
  try {
    const project = await projectModel.getOneProjectById(projectId);

    if (!project) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No project found");
    }

    const [team, members] = await Promise.all([
      teamModel.getOneTeamById(project.team_id),
      projectModel.getMembersOfProject(projectId)
    ]);

    return { ...project, team_name: team?.name, members };
  } catch (err) {
    throw err;
  }
};

const transferProjectOwnership = async (projectId, newOwnerUserId) => {
  try {
    const project = await projectModel.getOneProjectById(projectId);

    if (!project) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No project found");
    }

    const isMember = await projectModel.isUserInProject(projectId, newOwnerUserId);

    if (!isMember) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Target user is not a member of this project"
      );
    }

    const members = await projectModel.getMembersOfProject(projectId);
    const currentOwner = members.find((member) => member.role === "owner");

    if (currentOwner && currentOwner.id === newOwnerUserId) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "This user is already the project owner");
    }

    if (currentOwner) {
      await projectModel.updateProjectRoleOfUser(projectId, currentOwner.id, "admin");
    }

    await projectModel.updateProjectRoleOfUser(projectId, newOwnerUserId, "owner");

    return projectId;
  } catch (err) {
    throw err;
  }
};

const getSystemStats = async () => {
  try {
    const [userCount, teamCount, projectCount, taskCount] = await Promise.all([
      userModel.countUsers(),
      teamModel.countTeams(),
      projectModel.countProjects(),
      taskModel.countTasks()
    ]);

    return {
      user_count: userCount,
      team_count: teamCount,
      project_count: projectCount,
      task_count: taskCount
    };
  } catch (err) {
    throw err;
  }
};

const checkDependency = async (name, fn) => {
  const start = Date.now();

  try {
    await fn();

    return { name, status: "up", latency_ms: Date.now() - start };
  } catch (err) {
    return { name, status: "down", latency_ms: Date.now() - start, error: err.message };
  }
};

const getSystemHealth = async () => {
  try {
    const [database, storage, mail] = await Promise.all([
      checkDependency("database", () => adminModel.pingDatabase()),
      checkDependency("storage", () => storageProvider.checkConnection()),
      checkDependency("mail", () => mailProvider.checkConnection())
    ]);

    const io = getIoInstance();

    return {
      dependencies: [
        database,
        storage,
        mail,
        { name: "embedding", status: embeddingProvider.getStatus() }
      ],
      socket: {
        connections: io ? io.sockets.sockets.size : 0
      },
      process: {
        uptime_seconds: Math.round(process.uptime()),
        memory_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
        load_avg: os.loadavg()
      }
    };
  } catch (err) {
    throw err;
  }
};

export default {
  listUsers,
  getUserDetail,
  updateUserRole,
  setUserEnabled,
  forceLogoutUser,
  resendPasswordReset,
  listTeams,
  getTeamDetail,
  transferTeamOwnership,
  listProjects,
  getProjectDetail,
  transferProjectOwnership,
  getSystemStats,
  getSystemHealth
};
