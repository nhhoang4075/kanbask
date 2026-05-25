import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import path from "path";

import cloudinary from "../../config/cloudinary.js";
import { supabase } from "../../config/supabaseClient.js";
import multimediaModel from "../models/multimedia-model.js";
import ApiError from "../../utils/api-error.js";

const BUCKET_NAME = process.env.SUPABASE_BUCKET_FILES || "user-files";

const uploadFileToSupabase = async (
  fileBuffer,
  originalName,
  mimeType,
  sizeBytes,
  userId,
  task_id
) => {
  if (!fileBuffer) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No file buffer provided.");
  }
  const fileExtension = path.extname(originalName);
  const uniqueFileName = `${uuidv4()}${fileExtension}`;
  const filePath = `user_${userId}/${uniqueFileName}`;

  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false
    });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Supabase upload failed: ${error.message}`
      );
    }

    if (!data || !data.path) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Supabase upload failed: No path returned."
      );
    }

    const fileRecordData = {
      supabase_path: data.path,
      original_name: originalName,
      mime_type: mimeType,
      size_bytes: sizeBytes,
      uploaded_by: userId,
      task_id: task_id
    };
    const dbRecord = await multimediaModel.createFileRecord(fileRecordData);
    return dbRecord;
  } catch (err) {
    throw err;
  }
};

const uploadToCloudinary = (fileBuffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error("Cloudinary upload stream error:", error);
        return reject(
          new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Cloudinary upload failed: ${error.message}`
          )
        );
      }
      if (!result) {
        return reject(
          new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Cloudinary upload failed: No result returned."
          )
        );
      }
      resolve(result);
    });
    uploadStream.end(fileBuffer);
  });
};

const uploadImageOrVideoToCloudinary = async (
  fileBuffer,
  userId,
  message_id,
  resourceType = "auto"
) => {
  if (!fileBuffer) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No file buffer provided.");
  }

  const options = {
    resource_type: resourceType,
    folder: `user_${userId}`
  };

  try {
    const result = await uploadToCloudinary(fileBuffer, options);

    const assetRecordData = {
      cloudinary_public_id: result.public_id,
      secure_url: result.secure_url,
      asset_type: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      duration: result.duration,
      uploaded_by: userId,
      message_id: message_id
    };
    const dbRecord = await multimediaModel.createMediaAssetRecord(assetRecordData);
    return dbRecord;
  } catch (err) {
    throw err;
  }
};

const deleteFile = async (fileId, userId) => {
  const fileRecord = await multimediaModel.getFileRecordById(fileId);
  if (!fileRecord) {
    throw new ApiError(StatusCodes.NOT_FOUND, "File record not found.");
  }
  if (fileRecord.uploaded_by && fileRecord.uploaded_by !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not have permission to delete this file.");
  }

  try {
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileRecord.supabase_path]);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      if (deleteError.message !== "The resource was not found") {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          `Supabase delete failed: ${deleteError.message}`
        );
      } else {
        console.warn(
          `File not found on Supabase storage: ${fileRecord.supabase_path}. Proceeding to delete DB record.`
        );
      }
    }

    const deletedCount = await multimediaModel.deleteFileRecord(fileId);
    if (deletedCount === 0) {
      console.warn(`File record with ID ${fileId} was already deleted from DB.`);
    }
    return fileId;
  } catch (err) {
    throw err;
  }
};

const deleteMediaAsset = async (assetId, userId) => {
  const assetRecord = await multimediaModel.getMediaAssetRecordById(assetId);
  if (!assetRecord) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Media asset record not found.");
  }
  if (assetRecord.uploaded_by && assetRecord.uploaded_by !== userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You do not have permission to delete this media asset."
    );
  }

  try {
    const destroyResult = await cloudinary.uploader.destroy(assetRecord.cloudinary_public_id, {
      resource_type: assetRecord.asset_type
    });

    if (destroyResult.result !== "ok" && destroyResult.result !== "not found") {
      console.error("Cloudinary delete error:", destroyResult);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Cloudinary delete failed: ${destroyResult.result}`
      );
    }
    if (destroyResult.result === "not found") {
      console.warn(
        `Asset not found on Cloudinary: ${assetRecord.cloudinary_public_id}. Proceeding to delete DB record.`
      );
    }

    const deletedCount = await multimediaModel.deleteMediaAssetRecord(assetId);
    if (deletedCount === 0) {
      console.warn(`Media asset record with ID ${assetId} was already deleted from DB.`);
    }
    return assetId;
  } catch (err) {
    throw err;
  }
};

const downloadFileFromSupabase = async (fileId, userId) => {
  try {
    const file = await multimediaModel.getFileRecordById(fileId);
    if (!file) {
      throw new ApiError(StatusCodes.NOT_FOUND, "File not found.");
    }

    const ok = await multimediaModel.isUserAssignee(file.task_id, userId);
    if (!ok) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You do not have permission to download this file."
      );
    }

    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(file.supabase_path);

    if (error) {
      console.error("Supabase download error:", error);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Download failed: ${error.message}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return { buffer, mimeType: file.mime_type, originalName: file.original_name };
  } catch (err) {
    throw err;
  }
};

const downloadMediaAssetFromCloudinary = async (assetId, userId) => {
  try {
    const asset = await multimediaModel.getMediaAssetRecordById(assetId);
    if (!asset) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Media asset not found.");
    }

    const message = await multimediaModel.getMessageById(asset.message_id);
    if (!message) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Associated message not found.");
    }

    const ok = await multimediaModel.isUserParticipant(message.conversation_id, userId);
    if (!ok) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You do not have permission to download this media asset."
      );
    }

    return cloudinary.url(asset.cloudinary_public_id, {
      resource_type: asset.asset_type,
      secure: true
    });
  } catch (err) {
    throw err;
  }
};

export default {
  uploadFileToSupabase,
  uploadImageOrVideoToCloudinary,
  deleteFile,
  deleteMediaAsset,
  downloadFileFromSupabase,
  downloadMediaAssetFromCloudinary
};
