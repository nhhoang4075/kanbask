import { fetchWithAuth } from "./fetch-with-auth";

async function createOneProject(data) {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    } else {
      throw new Error("createOneProject API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function getProjectsOfUserInTeam() {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    } else {
      throw new Error("getProjectofUserInTeam API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function updateOneProjectById(id, data) {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.message;
    } else {
      throw new Error("updateOneProjectById API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function deleteOneProjectById(id) {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.message;
    } else {
      throw new Error("deleteOneProjectById API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function getMembersOfProject(id) {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/members`,
      {
        method: "GET",
        credentials: "include"
      }
    );

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.message;
    } else {
      throw new Error("getMembersOfProject API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function addMembersToProject(id, user_ids) {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/members`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_ids })
      }
    );

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.message;
    } else {
      throw new Error("addMembersToProject API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function removeMembersFromProject(id, user_ids) {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/members`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_ids })
      }
    );

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.message;
    } else {
      throw new Error("removeMembersFromProject API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function updateProjectRoleOfMember(id, user_id, role) {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/members`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, role })
      }
    );

    if (res.ok) {
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.message;
    } else {
      throw new Error("updateProjectRoleOfMember API Error");
    }
  } catch (err) {
    throw err;
  }
}

export {
  createOneProject,
  getProjectsOfUserInTeam,
  updateOneProjectById,
  deleteOneProjectById,
  addMembersToProject,
  getMembersOfProject,
  removeMembersFromProject,
  updateProjectRoleOfMember
};
