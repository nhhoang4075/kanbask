import { get } from "@/actions/fetch-client";

export async function getActivityLogsOfTask(taskId) {
  return get(`/logs/task?task_id=${taskId}`);
}

export async function getActivityLogsOfProject(projectId) {
  return get(`/logs/project?project_id=${projectId}`);
}
