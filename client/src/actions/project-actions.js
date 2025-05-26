import { get } from "@/actions/fetch-client";

export async function getProjectsOfTeam(teamId) {
  return get(`/projects?team_id=${teamId}`);
}
