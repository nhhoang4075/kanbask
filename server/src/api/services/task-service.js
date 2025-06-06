import { StatusCodes } from "http-status-codes";

import taskModel from "../models/task-model.js";
import taskActivityLogModel from "../models/task-activity-log-model.js";
import projectModel from "../models/project-model.js";
import attachmentModel from "../models/attachment-model.js";
import notificationModel from "../models/notification-model.js";
import ApiError from "../../utils/api-error.js";
import embeddingProvider from "../../config/embedding-provider.js";
import supabaseProvider from "../../config/supabase-provider.js";
import { emitNewNotification } from "../../socket/notification-socket.js";
import { sanitizeAllowedFields } from "../../utils/helper.js";

const createOneTask = async (data, actorId) => {
  try {
    const { project_id, title, description, status, priority, due_date, assignees } = data;

    const isProjectMember = await projectModel.isUserInProject(project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const embedding = await embeddingProvider.generateEmbedding(title);
    const position = await taskModel.getMaxTaskPositionOfProject(project_id);

    const taskId = await taskModel.createOneTask(
      {
        project_id,
        title,
        description,
        status,
        priority,
        due_date,
        created_by: actorId,
        embedding,
        position: position + 1
      },
      assignees
    );

    if (!taskId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create the task");
    }

    await taskActivityLogModel.createOneTaskActivityLog({
      task_id: taskId,
      user_id: actorId,
      action: "create",
      details: {}
    });

    await notifyAssigneesOfTask(
      taskId,
      "Task Assigned",
      `You have been assigned to a task: ${title}`
    );

    const task = await taskModel.getOneTaskById(taskId);
    const taskAssignees = await taskModel.getAssigneesOfTask(taskId);

    const formattedTask = { ...task, assignees: taskAssignees };

    return formattedTask;
  } catch (err) {
    throw err;
  }
};

const getManyTasksByProjectId = async (projectId, actorId) => {
  try {
    const isProjectMember = await projectModel.isUserInProject(projectId, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const tasks = await taskModel.getManyTasksByProjectId(projectId);

    const formattedTasks = await Promise.all(
      tasks.map(async (t) => {
        const assignees = await taskModel.getAssigneesOfTask(t.id);

        return {
          ...t,
          assignees
        };
      })
    );

    return formattedTasks;
  } catch (err) {
    throw err;
  }
};

const getAssignedTasksByUserId = async (actorId) => {
  try {
    const tasks = await taskModel.getAssignedTasksByUserId(actorId);

    return tasks;
  } catch (err) {
    throw err;
  }
};

const updateOneTaskById = async (id, data, actorId) => {
  try {
    const task = await taskModel.getOneTaskById(id);

    if (!task) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task not found");
    }

    const isProjectMember = await projectModel.isUserInProject(task.project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const allowedData = sanitizeAllowedFields(data, [
      "title",
      "description",
      "status",
      "priority",
      "due_date",
      "completed_at"
    ]);

    if (Object.keys(allowedData).length === 0 && !data.assignees && !data.position) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    await taskModel.updateOneTaskById(task.id, allowedData, data.assignees);

    if (data.position != null && task.position != data.position) {
      await taskModel.moveTask(task.id, task.project_id, task.position, data.position);
    }

    if (allowedData.title && allowedData.title !== task.title) {
      await taskActivityLogModel.createOneTaskActivityLog({
        task_id: task.id,
        user_id: actorId,
        action: "change_title",
        details: { old: task.title, new: allowedData.title }
      });
    }

    if (allowedData.due_date && allowedData.due_date !== task.status) {
      await taskActivityLogModel.createOneTaskActivityLog({
        task_id: task.id,
        user_id: actorId,
        action: "change_due_date",
        details: { old: task.due_date, new: allowedData.due_date }
      });
    }

    if (allowedData.status && allowedData.status !== task.status) {
      await taskActivityLogModel.createOneTaskActivityLog({
        task_id: task.id,
        user_id: actorId,
        action: "change_status",
        details: { old: task.status, new: allowedData.status }
      });
    }

    if (allowedData.assignees && allowedData.assignees.length > 0) {
      await notifyAssigneesOfTask(
        task.id,
        "Task Assigned",
        `You have been assigned to a task: ${task.title}`
      );
    }

    return task.id;
  } catch (err) {
    throw err;
  }
};

const deleteOneTaskById = async (id, actorId) => {
  try {
    const task = await taskModel.getOneTaskById(id);

    if (!task) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task not found");
    }

    const isProjectMember = await projectModel.isUserInProject(task.project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    await taskActivityLogModel.createOneTaskActivityLog({
      task_id: task.id,
      user_id: actorId,
      action: "delete",
      details: { deleted_task_title: task.title }
    });
    await taskModel.deleteOneTaskById(task.id);

    return task.id;
  } catch (err) {
    throw err;
  }
};

const uploadAttachmentsToTask = async (taskId, files, actorId) => {
  try {
    const task = await taskModel.getOneTaskById(taskId);

    if (!task) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task not found");
    }

    const isProjectMember = await projectModel.isUserInProject(task.project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    if (!files || files.length == 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No file provided");
    }

    const attachmentIds = [];

    await Promise.all(
      files.map(async (file) => {
        const path = `tasks/${actorId}`;
        const metadata = await supabaseProvider.uploadToStorage(file, path);

        const attachmentId = await attachmentModel.createOneAttachment({
          ...metadata,
          uploaded_by: actorId
        });

        attachmentIds.push(attachmentId);

        await attachmentModel.linkOneAttachmentToTask(task.id, attachmentId, actorId);
      })
    );

    await taskActivityLogModel.createOneTaskActivityLog({
      task_id: taskId,
      user_id: actorId,
      action: "attach",
      details: {}
    });

    const attachments = await Promise.all(
      attachmentIds.map(async (id) => {
        const attachment = await attachmentModel.getOneTaskAttachmentById(taskId, id);
        const url = await supabaseProvider.generateSignedUrl(attachment.supabase_path);

        delete attachment.supabase_path;

        return { ...attachment, url };
      })
    );

    return attachments;
  } catch (err) {
    throw err;
  }
};

const getManyAttachmentsByTaskId = async (taskId, actorId) => {
  try {
    const task = await taskModel.getOneTaskById(taskId);

    if (!task) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task not found");
    }

    const isProjectMember = await projectModel.isUserInProject(task.project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const attachments = await attachmentModel.getManyAttachmentsByTaskId(taskId);

    const formattedAttachments = await Promise.all(
      attachments.map(async (a) => {
        const url = await supabaseProvider.generateSignedUrl(a.supabase_path);

        delete a.supabase_path;

        return { ...a, url };
      })
    );

    return formattedAttachments;
  } catch (err) {
    throw err;
  }
};

const deleteAttachmentsFromTask = async (taskId, attachmentIds, actorId) => {
  try {
    const task = await taskModel.getOneTaskById(taskId);

    if (!task) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task not found");
    }

    const isProjectMember = await projectModel.isUserInProject(task.project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    if (!attachmentIds || attachmentIds.length == 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Attachments not found to delete");
    }

    await Promise.all(
      attachmentIds.map(async (id) => {
        const attachment = await attachmentModel.getOneAttachmentById(id);

        await supabaseProvider.deleteFromStorage(attachment.supabase_path);
        await attachmentModel.deleteOneAttachmentById(attachment.id);
      })
    );

    return task.id;
  } catch (err) {
    throw err;
  }
};

const notifyAssigneesOfTask = async (taskId, title, content) => {
  try {
    const assignees = await taskModel.getAssigneesOfTask(taskId);

    for (const assignee of assignees) {
      const notificationId = await notificationModel.createOneNotification({
        user_id: assignee.user_id,
        reference_type: "task",
        reference_id: taskId,
        title,
        content
      });

      const notification = await notificationModel.getOneNotificationById(notificationId);

      emitNewNotification(assignee.user_id, notification);
    }
  } catch (err) {
    throw err;
  }
};

export default {
  createOneTask,
  getManyTasksByProjectId,
  getAssignedTasksByUserId,
  updateOneTaskById,
  deleteOneTaskById,
  uploadAttachmentsToTask,
  getManyAttachmentsByTaskId,
  deleteAttachmentsFromTask
};
