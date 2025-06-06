import { StatusCodes } from "http-status-codes";
import multer from "multer";
import path from "path";

import ApiError from "../utils/api-error.js";

export const allowedFileTypes = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "image/webp", // WEBP
  "image/gif", // GIF
  "application/pdf", // PDF
  "application/msword", // DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.ms-excel", // XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  "application/vnd.ms-powerpoint", // PPT
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  "application/x-7z-compressed", // 7Z
  "application/zip", // ZIP
  "application/rar" // RAR
];

const allowedExtensions = [
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
  ".gif",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".7z",
  ".zip",
  ".rar"
];

const storage = multer.memoryStorage();

const customFileFilter = (req, file, cb) => {
  file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");

  const mimetype = file.mimetype;
  const ext = path.extname(file.originalname).toLowerCase();

  const isValidMimeType = allowedFileTypes.includes(mimetype);
  const isValidExtname = allowedExtensions.includes(ext);

  if (isValidMimeType && isValidExtname) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        `File type not allowed. Original name: ${file.originalname}, Mimetype: ${file.mimetype}`
      ),
      false
    );
  }
};

/**
 * Middleware uploadAttachment: cho phép upload các loại file đã list ở allowedFileTypes,
 * giới hạn kích thước tối đa 50MB.
 */
const uploadAttachment = multer({
  storage: storage,
  fileFilter: customFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const imageExtensions = [".jpeg", ".jpg", ".png", ".webp", ".gif"];

const imageFileFilter = (req, file, cb) => {
  file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");

  const mimetype = file.mimetype;
  const ext = path.extname(file.originalname).toLowerCase();

  const isValidImageMime = allowedImageTypes.includes(mimetype);
  const isValidImageExt = imageExtensions.includes(ext);

  if (isValidImageMime && isValidImageExt) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        `Only image files are allowed. Original name: ${file.originalname}, Mimetype: ${file.mimetype}`
      ),
      false
    );
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

export default { uploadAttachment, uploadImage };
