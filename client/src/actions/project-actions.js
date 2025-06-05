import { get, post, put, del } from "@/actions/fetch-client";

export async function createProject(data) {
  return post("/projects", data);
}

export async function getProjectsInTeamOfUser(teamId) {
  return get(`/projects?team_id=${teamId}`);
}

export async function updateProject(id, data) {
  return put(`/projects/${id}`, data);
}

export async function deleteProject(id) {
  return del(`/projects/${id}`);
}

export async function getMembersOfProject(id) {
  return get(`/projects/${id}/members`);
}

export async function addMembersToProject(id, data) {
  return post(`/projects/${id}/members`, data);
}

export async function removeMembersFromProject(id, data) {
  return del(`/projects/${id}/members`, data);
}

export async function updateProjectRoleOfMember(id, data) {
  return put(`/projects/${id}/members`, data);
}
