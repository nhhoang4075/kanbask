import { get, post, put, del } from "@/actions/fetch-client";

export async function createTeam(data) {
  return post("/teams", data);
}

export async function getTeamsOfUser() {
  return get("/teams");
}

export async function updateTeam(teamId, data) {
  return put(`/teams/${teamId}`, data);
}

export async function deleteTeam(teamId) {
  return del(`/teams/${teamId}`);
}

export async function getMembersOfTeam(teamId) {
  return get(`/teams/${teamId}/members`);
}

export async function removeMembersFromTeam(teamId, data) {
  return del(`/teams/${teamId}/members`, data);
}

export async function updateTeamRoleOfMember(teamId, data) {
  return put(`/teams/${teamId}/members`, data);
}

export async function leaveTeam(teamId) {
  return post(`/teams/${teamId}`);
}

export async function joinTeam(code) {
  return post(`/team-requests?code=${code}`);
}

export async function getJoinRequestsOfTeam(teamId) {
  return get(`/team-requests?team_id=${teamId}`);
}

export async function approveJoinRequest(requestId) {
  return post(`/team-requests/${requestId}`);
}

export async function rejectJoinRequest(requestId) {
  return put(`/team-requests/${requestId}`);
}
