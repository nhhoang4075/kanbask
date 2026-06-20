import { get } from "@/actions/fetch-client";

export async function getProjectsInTeam(teamId) {
  return get(`/projects?team_id=${teamId}`);
}