// src/providers/supabase-provider.js

import { createClient } from "@supabase/supabase-js";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import path from "path";
import ApiError from "../utils/api-error.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseBucket = process.env.SUPABASE_BUCKET_FILES;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
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
    const supabaseFilePath = `${folderPath}/${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from(supabaseBucket)
      .upload(supabaseFilePath, buffer, { contentType: mimetype, upsert: false });

    if (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Supabase error: ${error.message}`);
    }

    if (!data?.path) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Supabase error: No path returned.");
    }

    const metadata = {
      supabase_path: data.path,
      original_name: originalname,
      mime_type: mimetype,
      size_bytes: size
    };

    return metadata;
  } catch (err) {
    throw err;
  }
};

const deleteFromStorage = async (path) => {
  try {
    const { error } = await supabase.storage.from(supabaseBucket).remove([path]);

    if (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Supabase error: ${error.message}`);
    }
  } catch (err) {
    throw err;
  }
};

const generateSignedUrl = async (path) => {
  try {
    const { data, error } = await supabase.storage
      .from(supabaseBucket)
      .createSignedUrl(path, 24 * 60 * 60);

    if (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Supabase error: ${error.message}`);
    }

    if (!data || !data.signedUrl) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to generate download URL");
    }

    return data.signedUrl;
  } catch (err) {
    throw err;
  }
};

const generatePublicUrl = (path) => {
  try {
    const { data, error } = supabase.storage.from(supabaseBucket).getPublicUrl(path);

    if (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Supabase error: ${error.message}`);
    }

    if (!data || !data.publicUrl) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to generate public URL");
    }

    return data.publicUrl;
  } catch (err) {
    throw err;
  }
};

export default {
  uploadToStorage,
  deleteFromStorage,
  generateSignedUrl,
  generatePublicUrl
};
