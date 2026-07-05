import { StatusCodes } from "http-status-codes";

import adminService from "../services/admin-service.js";

const listUsers = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const { users, total } = await adminService.listUsers(q, { limit, offset });

    res.status(StatusCodes.OK).json({ success: true, data: { users, total } });
  } catch (error) {
    next(error);
  }
};

const getUserDetail = async (req, res, next) => {
  try {
    const user = await adminService.getUserDetail(req.params.id);

    res.status(StatusCodes.OK).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    await adminService.updateUserRole(req.params.id, req.body.role, req.user.id);

    res.status(StatusCodes.OK).json({ success: true, message: "Updated user role successfully" });
  } catch (error) {
    next(error);
  }
};

const setUserEnabled = async (req, res, next) => {
  try {
    await adminService.setUserEnabled(req.params.id, req.body.is_enabled, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: req.body.is_enabled
        ? "Enabled user account successfully"
        : "Disabled user account successfully"
    });
  } catch (error) {
    next(error);
  }
};

const forceLogoutUser = async (req, res, next) => {
  try {
    await adminService.forceLogoutUser(req.params.id);

    res.status(StatusCodes.OK).json({ success: true, message: "Forced logout successfully" });
  } catch (error) {
    next(error);
  }
};

const resendPasswordReset = async (req, res, next) => {
  try {
    await adminService.resendPasswordReset(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Password reset mail sent successfully" });
  } catch (error) {
    next(error);
  }
};

const listTeams = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const { teams, total } = await adminService.listTeams(q, { limit, offset });

    res.status(StatusCodes.OK).json({ success: true, data: { teams, total } });
  } catch (error) {
    next(error);
  }
};

const getTeamDetail = async (req, res, next) => {
  try {
    const team = await adminService.getTeamDetail(req.params.id);

    res.status(StatusCodes.OK).json({ success: true, data: { team } });
  } catch (error) {
    next(error);
  }
};

const transferTeamOwnership = async (req, res, next) => {
  try {
    await adminService.transferTeamOwnership(req.params.id, req.body.user_id);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Transferred team ownership successfully" });
  } catch (error) {
    next(error);
  }
};

const listProjects = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const { projects, total } = await adminService.listProjects(q, { limit, offset });

    res.status(StatusCodes.OK).json({ success: true, data: { projects, total } });
  } catch (error) {
    next(error);
  }
};

const getProjectDetail = async (req, res, next) => {
  try {
    const project = await adminService.getProjectDetail(req.params.id);

    res.status(StatusCodes.OK).json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

const transferProjectOwnership = async (req, res, next) => {
  try {
    await adminService.transferProjectOwnership(req.params.id, req.body.user_id);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Transferred project ownership successfully" });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getSystemStats();

    res.status(StatusCodes.OK).json({ success: true, data: { stats } });
  } catch (error) {
    next(error);
  }
};

const getHealth = async (req, res, next) => {
  try {
    const health = await adminService.getSystemHealth();

    res.status(StatusCodes.OK).json({ success: true, data: { health } });
  } catch (error) {
    next(error);
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
  getStats,
  getHealth
};
