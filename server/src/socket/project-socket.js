import { getIoInstance } from "./index.js";
import teamModel from "../api/models/team-model.js";

const emitProjectChanged = async (teamId, projectId) => {
  const io = getIoInstance();

  if (!io || !teamId) return;

  const members = await teamModel.getMembersOfTeam(teamId);

  for (const member of members) {
    io.to(`user_${member.id}`).emit("project_changed", { team_id: teamId, project_id: projectId });
  }
};

export { emitProjectChanged };
