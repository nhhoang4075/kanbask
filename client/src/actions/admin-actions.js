import { get, post, put } from "@/actions/fetch-client";

export async function getUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/admin/users${query ? `?${query}` : ""}`);
}

export async function getUserDetail(userId) {
  return get(`/admin/users/${userId}`);
}

export async function updateUserRole(userId, role) {
  return put(`/admin/users/${userId}/role`, { role });
}

export async function setUserEnabled(userId, isEnabled) {
  return put(`/admin/users/${userId}/status`, { is_enabled: isEnabled });
}

export async function forceLogoutUser(userId) {
  return post(`/admin/users/${userId}/force-logout`);
}

export async function resendPasswordReset(userId) {
  return post(`/admin/users/${userId}/resend-password-reset`);
}

export async function getTeams(params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/admin/teams${query ? `?${query}` : ""}`);
}

export async function getTeamDetail(teamId) {
  return get(`/admin/teams/${teamId}`);
}

export async function transferTeamOwnership(teamId, userId) {
  return post(`/admin/teams/${teamId}/transfer-ownership`, { user_id: userId });
}

export async function getProjects(params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/admin/projects${query ? `?${query}` : ""}`);
}

export async function getProjectDetail(projectId) {
  return get(`/admin/projects/${projectId}`);
}

export async function transferProjectOwnership(projectId, userId) {
  return post(`/admin/projects/${projectId}/transfer-ownership`, { user_id: userId });
}

export async function getStats() {
  return get("/admin/stats");
}

export async function getHealth() {
  return get("/admin/health");
}
