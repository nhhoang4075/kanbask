import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import path from "path";

import attachmentModel from "../models/attachment-model.js";
import { supabase } from "../../config/supabase.js";
import ApiError from "../../utils/api-error.js";

const BUCKET_NAME = process.env.SUPABASE_BUCKET_FILES || "user-files";

const uploadOneAttachmentToStorage = async (file, actorId) => {
  try {
    const { buffer, originalname, mimetype, size } = file;

    if (!buffer) throw new ApiError(StatusCodes.BAD_REQUEST, "No file buffer provided");

    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const safeName = slugify(name, {
      lower: true,
      strict: true
    });
    const uniqueFileName = `${Date.now()}-${safeName}${ext}`;
    const supabaseFilePath = `general/${actorId}/${uniqueFileName}`;

    const { data, error: supabaseError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(supabaseFilePath, buffer, { contentType: mimetype, upsert: false });

    if (supabaseError) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Supabase error: ${supabaseError.message}`
      );
    }

    if (!data?.path)
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Supabase error: No path returned.");

    const attachmentData = {
      supabase_path: data.path,
      original_name: originalname,
      mime_type: mimetype,
      size_bytes: size,
      uploaded_by: actorId
    };

    const attachmentId = await attachmentModel.createOneAttachment(attachmentData);

    const attachment = await attachmentModel.getOneAttachmentById(attachmentId);

    return attachment;
  } catch (err) {
    throw err;
  }
};

const generateDownloadUrlOfAttachment = async (attachmentId) => {
  try {
    const attachment = await attachmentModel.getOneAttachmentById(attachmentId);

    if (!attachment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found");
    }

    const { data, error: supabaseError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(attachment.supabase_path, 60 * 5);

    if (supabaseError) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Supabase error: ${supabaseError.message}`
      );
    }

    if (!data || !data.signedUrl) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to generate download URL");
    }

    return data.signedUrl;
  } catch (err) {
    throw err;
  }
};

const deleteAttachmentFromSystem = async (attachmentId, actorId) => {
  try {
    const attachment = await attachmentModel.getOneAttachmentById(attachmentId);

    if (!attachment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found");
    }

    if (attachment.uploaded_by !== actorId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You do not have permission to delete this attachment"
      );
    }

    const { error: supabaseError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([attachment.supabase_path]);

    if (supabaseError) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Supabase error: ${supabaseError.message}`
      );
    }

    await attachmentModel.deleteOneAttachmentById(attachmentId);

    return attachmentId;
  } catch (err) {
    throw err;
  }
};

const linkAttachmentToTask = async (taskId, attachmentId, actorId) => {
  try {
    const attachment = await attachmentModel.getOneAttachmentById(attachmentId);

    if (!attachment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found");
    }

    await attachmentModel.linkAttachmentToTask(taskId, attachmentId, actorId);

    return attachmentModel;
  } catch (err) {
    throw err;
  }
};

const getAttachmentsForTask = async (taskId, actorId) => {
  try {
    return await attachmentModel.getManyAttachmentsByTaskId(taskId);
  } catch (err) {
    throw err;
  }
};

const linkAttachmentToMessage = async (messageId, attachmentId, actorId) => {
  try {
    const attachment = await attachmentModel.getOneAttachmentById(attachmentId);

    if (!attachment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found");
    }

    await attachmentModel.linkAttachmentToMessage(messageId, attachmentId, actorId);

    return attachmentId;
  } catch (err) {
    throw err;
  }
};

const getAttachmentsForMessage = async (messageId, actorId) => {
  try {
    return await attachmentModel.getManyAttachmentsByMessageId(messageId);
  } catch (err) {
    throw err;
  }
};

const uploadAttachmentsToTask = async (taskId, files, actorId) => {
  try {
    if (!files || files.length == 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Files not found");
    }

    await Promise.all(
      files.map(async (file) => {
        const attachment = await uploadOneAttachmentToStorage(file, actorId);

        await attachmentModel.linkOneAttachmentToTask(taskId, attachment.id, actorId);
      })
    );

    return taskId;
  } catch (err) {
    throw err;
  }
};

export default {
  uploadOneAttachmentToStorage,
  generateDownloadUrlOfAttachment,
  deleteAttachmentFromSystem,
  linkAttachmentToTask,
  getAttachmentsForTask,
  linkAttachmentToMessage,
  getAttachmentsForMessage,
  uploadAttachmentsToTask
};
