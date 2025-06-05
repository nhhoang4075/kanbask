import { StatusCodes } from "http-status-codes";
import multer from "multer";
import path from "path";

import ApiError from "../utils/api-error.js";

const storage = multer.memoryStorage();

const defaultAllowedFileTypes =
  /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|mp4|mov|avi|txt|csv/;

const customFileFilter = (req, file, cb) => {
  file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");

  const isValidMimeType = defaultAllowedFileTypes.test(file.mimetype);
  const isValidExtname = defaultAllowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

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

const anyFileFilter = (req, file, cb) => {
  cb(null, true);
};

const uploadAttachment = multer({
  storage: storage,
  fileFilter: customFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

export default { uploadAttachment };
