import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { supabase } from "../../config/supabaseClient.js";
import attachmentModel from "../models/attachment-model.js";
import ApiError from "../../utils/api-error.js";

const BUCKET_NAME = process.env.SUPABASE_BUCKET_FILES || 'user-files';

const uploadFileAndRecord = async (fileBuffer, originalName, mimeType, sizeBytes, userId) => {
    if (!fileBuffer) throw new ApiError(StatusCodes.BAD_REQUEST, "No file buffer provided.");

    const fileExtension = path.extname(originalName);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const supabaseFilePath = `general/${userId}/${uniqueFileName}`;

    try {
        const { data, error } = await supabase.storage.from(BUCKET_NAME)
            .upload(supabaseFilePath, fileBuffer, { contentType: mimeType, upsert: false });

        if (error) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Supabase upload failed: ${error.message}`);
        if (!data?.path) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Supabase upload incomplete: No path returned.");

        const attachmentRecordData = {
            supabase_path: data.path,
            original_name: originalName,
            mime_type: mimeType,
            size_bytes: sizeBytes,
            uploaded_by: userId,
        };

        return await attachmentModel.createAttachment(attachmentRecordData);
    } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Failed to upload and record file.");
    }
};

const generateDownloadUrl = async (attachmentId, userId) => {
    const attachmentRecord = await attachmentModel.getAttachmentById(attachmentId);
    if (!attachmentRecord) throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found.");

    const { data, error: supabaseError } = await supabase.storage.from(BUCKET_NAME)
        .createSignedUrl(attachmentRecord.supabase_path, 60 * 5);

    if (supabaseError) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Supabase sign URL failed: ${supabaseError.message}`);
    }
    if (!data || !data.signedUrl) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to generate signed URL.");
    }
    return data.signedUrl;
};

const deleteAttachmentFromSystem = async (attachmentId, userId) => {
    const attachmentRecord = await attachmentModel.getAttachmentById(attachmentId);
    if (!attachmentRecord) throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found.");

    if (attachmentRecord.uploaded_by !== userId) {
        throw new ApiError(StatusCodes.FORBIDDEN, "You do not have permission to delete this attachment.");
    }

    try {
        const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([attachmentRecord.supabase_path]);

        if (deleteError && deleteError.message !== 'The resource was not found' && deleteError.name !== 'StorageManagementApiError') {
            console.error(`Supabase delete warning (attachmentId: ${attachmentId}): ${deleteError.message}`);
        }

        await attachmentModel.deleteAttachmentRecord(attachmentId);
        return attachmentId;
    } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Failed to delete attachment from system.");
    }
};

const linkAttachmentToTask = async (taskId, attachmentId, userId) => {
    const attachment = await attachmentModel.getAttachmentById(attachmentId);
    if (!attachment) throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found to link.");

    try {
        return await attachmentModel.linkAttachmentToTask(taskId, attachmentId, userId);
    } catch (err) {
        if (err.message && err.message.includes('duplicate key value violates unique constraint')) {
            throw new ApiError(StatusCodes.CONFLICT, "This attachment is already linked to the task.");
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Failed to link attachment to task.");
    }
};

const getAttachmentsForTask = async (taskId, userId) => {
    return await attachmentModel.getAttachmentsByTaskId(taskId);
};

const unlinkAttachmentFromTask = async (taskId, attachmentId, userId) => {
    const links = await attachmentModel.getAttachmentsByTaskId(taskId);
    const linkExists = links.some(link => link.id === attachmentId);

    if (!linkExists && !(await attachmentModel.isAttachmentLinkedToTask(taskId, attachmentId))) {}

    const deletedCount = await attachmentModel.unlinkAttachmentFromTask(taskId, attachmentId);
    if (deletedCount === 0) {
        const attachmentExists = await attachmentModel.getAttachmentById(attachmentId);
        if (!attachmentExists) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found.");
        }
        throw new ApiError(StatusCodes.NOT_FOUND, "Attachment link to this task not found or already unlinked.");
    }
    return { taskId, attachmentId };
};

const linkAttachmentToMessage = async (messageId, attachmentId, userId) => {
    const attachment = await attachmentModel.getAttachmentById(attachmentId);
    if (!attachment) throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found to link.");

    try {
        return await attachmentModel.linkAttachmentToMessage(messageId, attachmentId, userId);
    } catch (err) {
        if (err.message && err.message.includes('duplicate key value violates unique constraint')) {
            throw new ApiError(StatusCodes.CONFLICT, "This attachment is already linked to the message.");
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Failed to link attachment to message.");
    }
};

const getAttachmentsForMessage = async (messageId, userId) => {
    return await attachmentModel.getAttachmentsByMessageId(messageId);
};

const unlinkAttachmentFromMessage = async (messageId, attachmentId, userId) => {
    const deletedCount = await attachmentModel.unlinkAttachmentFromMessage(messageId, attachmentId);
    if (deletedCount === 0) {
        const attachmentExists = await attachmentModel.getAttachmentById(attachmentId);
        if (!attachmentExists) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found.");
        }
        throw new ApiError(StatusCodes.NOT_FOUND, "Attachment link to this message not found or already unlinked.");
    }
    return { messageId, attachmentId };
};

export default {
    uploadFileAndRecord,
    generateDownloadUrl,
    deleteAttachmentFromSystem,
    linkAttachmentToTask,
    getAttachmentsForTask,
    unlinkAttachmentFromTask,
    linkAttachmentToMessage,
    getAttachmentsForMessage,
    unlinkAttachmentFromMessage,
};
