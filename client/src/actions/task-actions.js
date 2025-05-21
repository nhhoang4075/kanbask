export async function getTasksOfProject(projectId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks?project_id=${projectId}`, {
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
      throw new Error("getTasksOfProject API Error");
    }
  } catch (err) {
    throw err;
  }
}