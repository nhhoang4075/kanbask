export async function getProjectsOfTeam(teamId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?team_id=${teamId}`, {
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
      throw new Error("getProjectsOfTeam API Error");
    }
  } catch (err) {
    throw err;
  }
}