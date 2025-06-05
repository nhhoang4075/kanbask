import { StatusCodes } from "http-status-codes";

import taskCommentModel from "../models/task-comment-model.js";
import taskModel from "../models/task-model.js";
import taskActivityLogModel from "../models/task-activity-log-model.js";
import projectModel from "../models/project-model.js";
import ApiError from "../../utils/api-error.js";
import { sanitizeAllowedFields } from "../../utils/helper.js";

const createOneTaskComment = async (data, actorId) => {
  try {
    const { task_id, content } = data;

    const task = await taskModel.getOneTaskById(task_id);

    if (!task) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task not found");
    }

    const isProjectMember = await projectModel.isUserInProject(task.project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const commentId = await taskCommentModel.createOneTaskComment({
      task_id,
      content,
      user_id: actorId
    });

    if (!commentId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create the comment");
    }

    await taskActivityLogModel.createOneTaskActivityLog({
      task_id: task.id,
      user_id: actorId,
      action: "comment",
      details: {}
    });

    const comment = await taskCommentModel.getOneTaskCommentById(commentId);

    return comment;
  } catch (err) {
    throw err;
  }
};

const getManyTaskCommentsByTaskId = async (taskId, actorId) => {
  try {
    const task = await taskModel.getOneTaskById(taskId);

    if (!task) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task not found");
    }

    const isProjectMember = await projectModel.isUserInProject(task.project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const comments = await taskCommentModel.getManyTaskCommentsByTaskId(taskId);

    return comments;
  } catch (err) {
    throw err;
  }
};

const updateOneTaskCommentById = async (id, updateData, actorId) => {
  try {
    const comment = await taskCommentModel.getOneTaskCommentById(id);

    if (!comment) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Comment not found");
    }

    if (comment.commenter_id !== actorId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only author of comment can access this");
    }

    const allowedData = sanitizeAllowedFields(updateData, ["content"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    await taskCommentModel.updateOneTaskCommentById(comment.id, allowedData);

    return comment.id;
  } catch (err) {
    throw err;
  }
};

const deleteOneTaskCommentById = async (id, actorId) => {
  try {
    const comment = await taskCommentModel.getOneTaskCommentById(id);

    if (!comment) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Comment not found");
    }

    if (comment.commenter_id !== actorId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only author of comment can access this");
    }

    await taskCommentModel.deleteOneTaskCommentById(comment.id);

    return comment.id;
  } catch (err) {
    throw err;
  }
};

export default {
  createOneTaskComment,
  getManyTaskCommentsByTaskId,
  updateOneTaskCommentById,
  deleteOneTaskCommentById
};
