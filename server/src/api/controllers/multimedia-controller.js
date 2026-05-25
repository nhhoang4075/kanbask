import { StatusCodes } from "http-status-codes";
import multimediaService from "../services/multimedia-service.js";
import ApiError from "../../utils/api-error.js";

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded.");
    }
    const userId = req.user.id;
    const task_id = req.params.task_id;
    const { buffer, originalname, mimetype, size } = req.file;

    const fileRecord = await multimediaService.uploadFileToSupabase(
      buffer,
      originalname,
      mimetype,
      size,
      userId,
      task_id
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: fileRecord
    });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No image uploaded.");
    }
    const userId = req.user.id;
    const message_id = req.params.message_id;
    const { buffer } = req.file;

    const assetRecord = await multimediaService.uploadImageOrVideoToCloudinary(
      buffer,
      userId,
      message_id,
      "image"
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Image uploaded successfully to Cloudinary.",
      data: assetRecord
    });
  } catch (error) {
    next(error);
  }
};

const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No video uploaded.");
    }
    const userId = req.user.id;
    const message_id = req.params.message_id;
    const { buffer } = req.file;

    const assetRecord = await multimediaService.uploadImageOrVideoToCloudinary(
      buffer,
      userId,
      message_id,
      "video"
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Video uploaded successfully to Cloudinary.",
      data: assetRecord
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    const deletedId = await multimediaService.deleteFile(fileId, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `File ${deletedId} deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

const deleteMediaAsset = async (req, res, next) => {
  try {
    const assetId = req.params.id;
    const userId = req.user.id;

    const deletedId = await multimediaService.deleteMediaAsset(assetId, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Media asset ${deletedId} deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

const downloadFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;
    const isPreview = req.query.preview === "true";

    const fileData = await multimediaService.downloadFileFromSupabase(fileId, userId);

    if (isPreview) {
      res.setHeader("Content-Type", fileData.mimeType);
      res.setHeader("Content-Disposition", `inline; filename="${fileData.originalName}"`);
      res.send(fileData.buffer);
    } else {
      res.setHeader("Content-Type", fileData.mimeType);
      res.setHeader("Content-Disposition", `attachment; filename="${fileData.originalName}"`);
      res.send(fileData.buffer);
    }
  } catch (error) {
    next(error);
  }
};

const downloadImageOrVideo = async (req, res, next) => {
  try {
    const assetId = req.params.id;
    const userId = req.user.id;

    const url = await multimediaService.downloadMediaAssetFromCloudinary(assetId, userId);

    res.redirect(url);
  } catch (error) {
    next(error);
  }
};

export default {
  uploadFile,
  uploadImage,
  uploadVideo,
  deleteFile,
  deleteMediaAsset,
  downloadFile,
  downloadImageOrVideo
};
