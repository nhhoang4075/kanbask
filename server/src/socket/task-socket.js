import { getIoInstance } from "./index.js";
import projectModel from "../api/models/project-model.js";

const emitTaskChanged = async (projectId) => {
  const io = getIoInstance();

  if (!io || !projectId) return;

  const members = await projectModel.getMembersOfProject(projectId);

  for (const member of members) {
    io.to(`user_${member.id}`).emit("task_changed", { project_id: projectId });
  }
};

export { emitTaskChanged };
