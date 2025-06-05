import { get, post, put, del } from "@/actions/fetch-client";

export async function createTaskComment(data) {
  return post(`/task-comments`, data);
}

export async function getTaskComments(taskId) {
  return get(`/task-comments?task_id=${taskId}`);
}

export async function updateTaskComment(commentId, data) {
  return put(`/task-comments/${commentId}`, data);
}

export async function deleteTaskComment(commentId) {
  return del(`/task-comments/${commentId}`);
}
