import { db } from "../../config/db.js";

const createOneAttachment = async (data) => {
  try {
    const [attachment] = await db("storage_attachments").insert(data).returning("id");

    return attachment.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneAttachmentById = async (id) => {
  try {
    const [attachment] = await db("storage_attachments").where({ id }).limit(1);

    return attachment;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneTaskAttachmentById = async (task_id, id) => {
  try {
    const [attachment] = await db("task_attachments AS ta")
      .join("storage_attachments AS sa", "sa.id", "=", "ta.attachment_id")
      .join("user_public_view AS v", "v.id", "=", "ta.attached_by")
      .where("ta.task_id", task_id)
      .andWhere("sa.id", id)
      .select(
        "sa.id",
        "ta.task_id",
        "sa.supabase_path",
        "sa.original_name",
        "sa.mime_type",
        "sa.size_bytes",
        "ta.attached_by AS attacher_id",
        "v.full_name AS attacher_full_name",
        "v.avatar_url AS attacher_avatar_url",
        "ta.attached_at"
      )
      .limit(1);

    return attachment;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyAttachmentsByTaskId = async (task_id) => {
  try {
    const attachments = await db("task_attachments AS ta")
      .join("storage_attachments AS sa", "sa.id", "=", "ta.attachment_id")
      .join("user_public_view AS v", "v.id", "=", "ta.attached_by")
      .where("ta.task_id", task_id)
      .select(
        "sa.id",
        "ta.task_id",
        "sa.supabase_path",
        "sa.original_name",
        "sa.mime_type",
        "sa.size_bytes",
        "ta.attached_by AS attacher_id",
        "v.full_name AS attacher_full_name",
        "v.avatar_url AS attacher_avatar_url",
        "ta.attached_at"
      )
      .orderBy("ta.attached_at", "asc");

    return attachments;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyAttachmentsByMessageId = async (message_id) => {
  try {
    const attachments = await db("message_attachments AS ma")
      .join("storage_attachments AS sa", "sa.id", "=", "ma.attachment_id")
      .join("user_public_view AS v", "v.id", "=", "ma.attached_by")
      .where("ma.message_id", message_id)
      .select(
        "sa.id",
        "ma.message_id",
        "sa.supabase_path",
        "sa.original_name",
        "sa.mime_type",
        "sa.size_bytes",
        "ma.attached_by AS attacher_id",
        "v.full_name AS attacher_full_name",
        "v.avatar_url AS attacher_avatar_url",
        "ma.attached_at"
      )
      .orderBy("ma.attached_at", "asc");

    return attachments;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneAttachmentById = async (id) => {
  try {
    const [attachment] = await db("storage_attachments").delete().where({ id }).returning("id");

    return attachment.id;
  } catch (err) {
    throw new Error(err);
  }
};

const linkOneAttachmentToTask = async (task_id, attachment_id, attached_by) => {
  try {
    await db("task_attachments").insert({ task_id, attachment_id, attached_by });

    return attachment_id;
  } catch (err) {
    throw new Error(err);
  }
};

const linkOneAttachmentToMessage = async (message_id, attachment_id, attached_by) => {
  try {
    await db("message_attachments").insert({
      message_id,
      attachment_id,
      attached_by
    });

    return attachment_id;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneAttachment,
  getOneAttachmentById,
  getOneTaskAttachmentById,
  getManyAttachmentsByTaskId,
  getManyAttachmentsByMessageId,
  deleteOneAttachmentById,
  linkOneAttachmentToTask,
  linkOneAttachmentToMessage
};
