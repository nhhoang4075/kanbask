import multer from "multer";
import ApiError from "../utils/api-error.js";
import { StatusCodes } from "http-status-codes";

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCodes.BAD_REQUEST, "Only image files are allowed!"), false);
  }
};

const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCodes.BAD_REQUEST, "Only video files are allowed!"), false);
  }
};

const anyFileFilter = (req, file, cb) => {
  cb(null, true);
};

const limits = {
  fileSize_image: 10 * 1024 * 1024, // 10 MB
  fileSize_video: 100 * 1024 * 1024, // 100 MB
  fileSize_file: 50 * 1024 * 1024 // 50 MB
};

const uploadImage = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: limits.fileSize_image }
});

const uploadVideo = multer({
  storage: storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: limits.fileSize_video }
});

const uploadAnyFile = multer({
  storage: storage,
  fileFilter: anyFileFilter,
  limits: { fileSize: limits.fileSize_file }
});

export default {
  uploadImage,
  uploadVideo,
  uploadAnyFile
};
