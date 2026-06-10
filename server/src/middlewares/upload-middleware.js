import multer from "multer";
import path from "path";
import ApiError from "../utils/api-error.js";
import { StatusCodes } from "http-status-codes";

const storage = multer.memoryStorage();

const defaultAllowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|mp4|mov|avi|txt|csv/;

const customFileFilter = (req, file, cb) => {
  const isValidMimeType = defaultAllowedFileTypes.test(file.mimetype);
  const isValidExtname = defaultAllowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (isValidMimeType && isValidExtname) {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCodes.BAD_REQUEST, `File type not allowed. Original name: ${file.originalname}, Mimetype: ${file.mimetype}`), false);
  }
};

const anyFileFilter = (req, file, cb) => {
  cb(null, true);
};

const limits = {
  fileSize_file: 50 * 1024 * 1024
};

const uploadAttachmentInstance = multer({
  storage: storage,
  fileFilter: anyFileFilter,
  limits: { fileSize: limits.fileSize_file }
});

export default {
  uploadAttachment: uploadAttachmentInstance
};
