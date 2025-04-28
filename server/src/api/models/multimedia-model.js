import { db } from "../../config/db.js";

const createFileRecord = async (fileData) => {
  try {
    const [newFile] = await db("files").insert(fileData).returning("*");
    return newFile;
  } catch (err) {
    throw err;
  }
};

const createMediaAssetRecord = async (assetData) => {
  try {
    const [newAsset] = await db("media_assets").insert(assetData).returning("*");
    return newAsset;
  } catch (err) {
    throw err;
  }
};

const getFileRecordById = async (id) => {
  try {
    const file = await db("files").where({ id }).first();
    return file;
  } catch (err) {
    throw err;
  }
};

const getMediaAssetRecordById = async (id) => {
  try {
    const asset = await db("media_assets").where({ id }).first();
    return asset;
  } catch (err) {
    throw err;
  }
};

const deleteFileRecord = async (id) => {
  try {
    const count = await db("files").where({ id }).delete();
    return count;
  } catch (err) {
    throw err;
  }
};

const deleteMediaAssetRecord = async (id) => {
  try {
    const count = await db("media_assets").where({ id }).delete();
    return count;
  } catch (err) {
    throw err;
  }
};

const isUserAssignee = async (taskId, userId) => {
  try {
    const row = await db("task_assignees").where({ task_id: taskId, user_id: userId }).first();
    return !!row;
  } catch (err) {
    throw err;
  }
};

const getMessageById = async (messageId) => {
  try {
    return await db("messages").where({ id: messageId }).first();
  } catch (err) {
    throw err;
  }
};

const isUserParticipant = async (conversationId, userId) => {
  try {
    const row = await db("conversation_participants")
      .where({ conversation_id: conversationId, user_id: userId })
      .first();
    return !!row;
  } catch (err) {
    throw err;
  }
};

export default {
  createFileRecord,
  createMediaAssetRecord,
  getFileRecordById,
  getMediaAssetRecordById,
  deleteFileRecord,
  deleteMediaAssetRecord,
  isUserAssignee,
  getMessageById,
  isUserParticipant
};
