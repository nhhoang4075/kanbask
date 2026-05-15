import projectService from "../api/services/project-service";

const authorizeAdmin = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const user_id = req.user.id;

    await projectService.checkUserProjectAdmin(project_id, user_id);
    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authorizeAdmin
};
