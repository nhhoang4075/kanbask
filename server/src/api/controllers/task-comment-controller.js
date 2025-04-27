import taskCommentService from "../services/task-comment-service.js";
import { StatusCodes } from "http-status-codes";


const createOneComment = async (req, res, next) => {
  try {
    const comment = await taskCommentService.createOneComment(req.body);
    res.status(StatusCodes.CREATED).json({
        success: true,
        messsage: "Comment created successfully"
      });
  } catch (err) {
    next(err);
  }
};


const getCommentsByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const comments = await taskCommentService.getCommentsByTaskId(taskId);
    res.status(StatusCodes.OK).json({
        success: true,
        data: { comments }
      });
  } catch (err) {
    next(err);
  }
};


const updateOneComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedComment = await taskCommentService.updateOneComment(id, content);
    res.status(StatusCodes.OK).json({
        success: true,
        messsage: "Update comment successfully"
  });
    }catch (err) {
    next(err);
  }
};


const deleteOneComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedId = await taskCommentService.deleteOneComment(id);
    res.status(StatusCodes.OK).json({
        success: true,
        messsage: "Delete comment successfully"
      });
  } catch (err) {
    next(err);
  }
};


export default {
  createOneComment,
  getCommentsByTaskId,
  updateOneComment,
  deleteOneComment
};
