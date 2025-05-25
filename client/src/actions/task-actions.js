import { post, get, put, del } from "@/actions/fetch-client";

export async function createTask(data) {
  return post("/tasks", data);
}

export async function getTaskOfProject(projectId) {
  return get(`/tasks?project_id=${projectId}`);
}

export async function updateTask(taskId, data) {
  return put(`/tasks/${taskId}`, data);
}

export async function deleteTask(taskId) {
  return del(`/tasks/${taskId}`);
}

export async function uploadTaskAttachments(taskId, files) {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  return post(`/tasks/${taskId}/attachments`, formData);
}

export async function getTaskAttachmentUrl(taskId, attachmentId) {
  return get(`/tasks/${taskId}/attachments?attachment_id=${attachmentId}`);
}

export async function deleteTaskAttachments(taskId, attachmentIds) {
  return del(`/tasks/${taskId}/attachments`, { attachment_ids: attachmentIds });
}
