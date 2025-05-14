import { StatusCodes } from "http-status-codes";
import attachmentService from "../services/attachment-service.js";
import ApiError from "../../utils/api-error.js";

const uploadAttachment = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded.");
    }
    const userId = req.user.id;
    const { buffer, originalname, mimetype, size } = req.file;

    const attachmentRecord = await attachmentService.uploadFileAndRecord(
      buffer,
      originalname,
      mimetype,
      size,
      userId
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: attachmentRecord
    });
  } catch (error) {
    next(error);
  }
};

const downloadAttachment = async (req, res, next) => {
  try {
    const { attachmentId } = req.params;
    const userId = req.user.id;

    const downloadUrl = await attachmentService.generateDownloadUrl(attachmentId, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        downloadUrl: downloadUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteSystemAttachment = async (req, res, next) => {
  try {
    const { attachmentId } = req.params;
    const userId = req.user.id;

    const deletedAttachmentId = await attachmentService.deleteAttachmentFromSystem(attachmentId, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Attachment ${deletedAttachmentId} deleted successfully from system.`
    });
  } catch (error) {
    next(error);
  }
};

const linkToTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { attachmentId } = req.body;
    const userId = req.user.id;

    const link = await attachmentService.linkAttachmentToTask(taskId, attachmentId, userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Attachment linked to task successfully.",
      data: link
    });
  } catch (error) {
    next(error);
  }
};

const getTaskAttachments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const attachments = await attachmentService.getAttachmentsForTask(taskId, userId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: attachments
    });
  } catch (error) {
    next(error);
  }
};

const unlinkFromTask = async (req, res, next) => {
  try {
    const { taskId, attachmentId } = req.params;
    const userId = req.user.id;

    const result = await attachmentService.unlinkAttachmentFromTask(taskId, attachmentId, userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Attachment unlinked from task successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const linkToMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { attachmentId } = req.body;
    const userId = req.user.id;

    const link = await attachmentService.linkAttachmentToMessage(messageId, attachmentId, userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Attachment linked to message successfully.",
      data: link
    });
  } catch (error) {
    next(error);
  }
};

const getMessageAttachments = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const attachments = await attachmentService.getAttachmentsForMessage(messageId, userId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: attachments
    });
  } catch (error) {
    next(error);
  }
};

const unlinkFromMessage = async (req, res, next) => {
  try {
    const { messageId, attachmentId } = req.params;
    const userId = req.user.id;

    const result = await attachmentService.unlinkAttachmentFromMessage(messageId, attachmentId, userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Attachment unlinked from message successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export default {
  uploadAttachment,
  downloadAttachment,
  deleteSystemAttachment,
  linkToTask,
  getTaskAttachments,
  unlinkFromTask,
  linkToMessage,
  getMessageAttachments,
  unlinkFromMessage
};
