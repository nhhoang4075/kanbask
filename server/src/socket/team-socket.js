import { getIoInstance } from "./index.js";
import teamModel from "../api/models/team-model.js";

const emitTeamChanged = async (teamId) => {
  const io = getIoInstance();

  if (!io || !teamId) return;

  const members = await teamModel.getMembersOfTeam(teamId);

  for (const member of members) {
    io.to(`user_${member.id}`).emit("team_changed", { team_id: teamId });
  }
};

export { emitTeamChanged };
