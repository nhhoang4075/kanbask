// src/config/storage-provider.js
// Cloudflare R2 (S3-compatible object storage)

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import path from "path";
import ApiError from "../utils/api-error.js";

const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2Bucket = process.env.R2_BUCKET_NAME;
const r2PublicUrl = process.env.R2_PUBLIC_URL;

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});

const uploadToStorage = async (file, folderPath) => {
  try {
    const { buffer, originalname, mimetype, size } = file;

    if (!buffer) throw new ApiError(StatusCodes.BAD_REQUEST, "No file buffer provided");

    const ext = path.extname(originalname);
    const name = path.basename(originalname, ext);
    const safeName = slugify(name, {
      lower: true,
      strict: true
    });
    const uniqueFileName = `${Date.now()}-${safeName}${ext}`;
    const storageKey = `${folderPath}/${uniqueFileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: storageKey,
        Body: buffer,
        ContentType: mimetype
      })
    );

    const metadata = {
      storage_key: storageKey,
      original_name: originalname,
      mime_type: mimetype,
      size_bytes: size
    };

    return metadata;
  } catch (err) {
    throw err;
  }
};

const deleteFromStorage = async (storageKey) => {
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: r2Bucket, Key: storageKey }));
  } catch (err) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `R2 error: ${err.message}`);
  }
};

const generateSignedUrl = async (storageKey) => {
  try {
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: r2Bucket, Key: storageKey }),
      { expiresIn: 24 * 60 * 60 }
    );

    return url;
  } catch (err) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `R2 error: ${err.message}`);
  }
};

const generatePublicUrl = (storageKey) => {
  return `${r2PublicUrl}/${storageKey}`;
};

const checkConnection = async () => {
  await s3.send(new HeadBucketCommand({ Bucket: r2Bucket }));
};

export default {
  uploadToStorage,
  deleteFromStorage,
  generateSignedUrl,
  generatePublicUrl,
  checkConnection
};
