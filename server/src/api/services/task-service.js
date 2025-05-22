import { StatusCodes } from "http-status-codes";

import taskModel from "../models/task-model.js";
import taskActivityLogModel from "../models/task-activity-log-model.js";
import projectModel from "../models/project-model.js";
import attachmentModel from "../models/attachment-model.js";
import ApiError from "../../utils/api-error.js";
import embeddingProvider from "../../config/embedding-provider.js";
import supabaseProvider from "../../config/supabase-provider.js";
import { sanitizeAllowedFields } from "../../utils/helper.js";

const createOneTask = async (data, actorId) => {
  try {
    const { project_id, title, status, priority, due_date, assignees } = data;

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
        const [assignees, attachments] = await Promise.all([
          taskModel.getAssigneesOfTask(t.id),
          attachmentModel.getManyAttachmentsByTaskId(t.id)
        ]);

        const formattedAttachments = await Promise.all(
          attachments.map(async (a) => ({
            id: a.id,
            original_name: a.original_name,
            mime_type: a.mime_type,
            size_bytes: a.size_bytes,
            attached_by: a.attached_by,
            attached_at: a.attached_at
            // url: await supabaseProvider.generateUrl(a.supabase_path)
          }))
        );

        return {
          ...t,
          assignees,
          attachments: formattedAttachments
        };
      })
    );

    return formattedTasks;
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
      throw new ApiError(StatusCodes.BAD_REQUEST, "Files not found");
    }

    await Promise.all(
      files.map(async (file) => {
        const path = `tasks/${actorId}`;
        const metadata = await supabaseProvider.uploadToStorage(file, path);

        const attachmentId = await attachmentModel.createOneAttachment({
          ...metadata,
          uploaded_by: actorId
        });

        await attachmentModel.linkOneAttachmentToTask(task.id, attachmentId, actorId);
      })
    );

    await taskActivityLogModel.createOneTaskActivityLog({
      task_id: taskId,
      user_id: actorId,
      action: "attach",
      details: {}
    });

    return task.id;
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

const getAttachmentUrlOfTask = async (taskId, attachmentId, actorId) => {
  try {
    const task = await taskModel.getOneTaskById(taskId);

    if (!task) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task not found");
    }

    const isProjectMember = await projectModel.isUserInProject(task.project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const attachment = await attachmentModel.getOneAttachmentById(attachmentId);

    const url = await supabaseProvider.generateUrl(attachment.supabase_path);

    return url;
  } catch (err) {
    throw err;
  }
};

export default {
  createOneTask,
  getManyTasksByProjectId,
  updateOneTaskById,
  deleteOneTaskById,
  uploadAttachmentsToTask,
  deleteAttachmentsFromTask,
  getAttachmentUrlOfTask
};
