import { fetchWithAuth } from "./fetch-with-auth";

async function getActivityLogsOfTask(task_id) {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/logs/task?task_id=${task_id}`,
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

      return json.data;
    } else {
      throw new Error("getActivityLogsOfTask API Error");
    }
  } catch (err) {
    throw err;
  }
}

async function getActivityLogsOfProjectTasks(project_id) {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/logs/project?project_id=${project_id}`,
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

      return json.data;
    } else {
      throw new Error("getActivityLogsOfProjectTasks API Error");
    }
  } catch (err) {
    throw err;
  }
}

export { getActivityLogsOfTask, getActivityLogsOfProjectTasks };
