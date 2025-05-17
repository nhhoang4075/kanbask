import { StatusCodes } from "http-status-codes";

import attachmentService from "../services/attachment-service.js";

const downloadAttachment = async (req, res, next) => {
  try {
    const { attachment_id } = req.params;

    const download_url = await attachmentService.generateDownloadUrlOfAttachment(
      attachment_id,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: { download_url }
    });
  } catch (error) {
    next(error);
  }
};

const deleteSystemAttachment = async (req, res, next) => {
  try {
    const { attachment_id } = req.params;
    const userId = req.user.id;

    const deletedAttachmentId = await attachmentService.deleteAttachmentFromSystem(
      attachment_id,
      userId
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Attachment ${deletedAttachmentId} deleted successfully from system.`
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

const UploadToMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const { buffer, originalname, mimetype, size } = req.file;

    const attachmentRecord = await attachmentService.uploadFileAndRecord(
      buffer,
      originalname,
      mimetype,
      size,
      userId
    );

    const link = await attachmentService.linkAttachmentToMessage(
      messageId,
      attachmentRecord.id,
      userId
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
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

const uploadAttachmentsToTask = async (req, res, next) => {
  try {
    await attachmentService.uploadAttachmentsToTask(req.params.taskId, req.files, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OK"
    });
  } catch (error) {
    next(error);
  }
};

export default {
  downloadAttachment,
  deleteSystemAttachment,
  getTaskAttachments,
  UploadToMessage,
  getMessageAttachments,
  uploadAttachmentsToTask
};
