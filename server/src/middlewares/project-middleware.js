import projectService from "../api/services/project-service.js";

const authorizeAdmin = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const user_id = req.user.id;

    await projectService.checkProjectAdmin(project_id, user_id);
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeMember = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const user_id = req.user.id;

    await projectService.ensureUserInProject(project_id, user_id);
    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authorizeAdmin,
  authorizeMember
};
