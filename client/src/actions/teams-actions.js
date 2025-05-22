import { fetchWithAuth } from "./fetch-with-auth";

async function createTeam(data) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } else {
    throw new Error("createTeam API Error");
  }
}

async function getUserTeams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
    method: "GET",
    credentials: "include"
  });

  console.log(res);

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data.teams;
  } else {
    throw new Error("getUserTeams API Error");
  }
}

async function updateTeam(teamId, data) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.message;
  } else {
    throw new Error("updateTeam API Error");
  }
}

async function deleteTeam(teamId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.message;
  } else {
    throw new Error("deleteTeam API Error");
  }
}

async function getTeamMembers(teamId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}/members`, {
    method: "GET",
    credentials: "include"
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } else {
    throw new Error("getTeamMembers API Error");
  }
}

async function removeMembers(teamId, user_ids) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}/members`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_ids })
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.message;
  } else {
    throw new Error("removeMembers API Error");
  }
}

async function updateTeamMemberRole(teamId, user_id, role) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}/members`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id, role })
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.message;
  } else {
    throw new Error("updateTeamMemberRole API Error");
  }
}

async function joinTeamByCode(code) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team-requests?code=${code}`, {
    method: "POST",
    credentials: "include"
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.message;
  } else {
    throw new Error("joinTeamByCode API Error");
  }
}

async function leaveTeam(teamId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}`, {
    method: "POST",
    credentials: "include"
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.message;
  } else {
    throw new Error("leaveTeam API Error");
  }
}

async function getJoinRequests(teamId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/team-requests?team_id=${teamId}`,
    {
      method: "GET",
      credentials: "include"
    }
  );

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } else {
    throw new Error("getJoinRequests API Error");
  }
}

async function approveJoinRequest(requestId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team-requests/${requestId}`, {
    method: "POST",
    credentials: "include"
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.message;
  } else {
    throw new Error("approveJoinRequest API Error");
  }
}

async function rejectJoinRequest(requestId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team-requests/${requestId}`, {
    method: "PUT",
    credentials: "include"
  });

  if (res.ok) {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.message;
  } else {
    throw new Error("rejectJoinRequest API Error");
  }
}

export {
  createTeam,
  getUserTeams,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  removeMembers,
  updateTeamMemberRole,
  joinTeamByCode,
  leaveTeam,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest
};
