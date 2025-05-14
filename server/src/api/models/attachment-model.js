import { db } from "../../config/db.js";

const createAttachment = async (attachmentData) => {
  try {
    const [newAttachment] = await db("storage_attachments").insert(attachmentData).returning("*");
    return newAttachment;
  } catch (err) {
    throw err;
  }
};

const getAttachmentById = async (id) => {
  try {
    return await db("storage_attachments").where({ id }).first();
  } catch (err) {
    throw err;
  }
};

const deleteAttachmentRecord = async (id) => {
  try {
    const deletedCount = await db("storage_attachments").where({ id }).delete();
    return deletedCount;
  } catch (err) {
    throw err;
  }
};

const linkAttachmentToTask = async (taskId, attachmentId, attachedBy) => {
  try {
    const [link] = await db("task_attachments")
      .insert({ task_id: taskId, attachment_id: attachmentId, attached_by: attachedBy })
      .returning("*");
    return link;
  } catch (err) {
    throw err;
  }
};

const getAttachmentsByTaskId = async (taskId) => {
  try {
    return await db("task_attachments as ta")
      .join("storage_attachments as sa", "ta.attachment_id", "sa.id")
      .where("ta.task_id", taskId)
      .select(
        "sa.id",
        "sa.supabase_path",
        "sa.original_name",
        "sa.mime_type",
        "sa.size_bytes",
        "sa.uploaded_by as attachment_uploader",
        "sa.created_at as attachment_created_at",
        "ta.attached_by as task_linker",
        "ta.attached_at as task_linked_at"
      )
      .orderBy("ta.attached_at", "asc");
  } catch (err) {
    throw err;
  }
};

const isAttachmentLinkedToTask = async (taskId, attachmentId) => {
  try {
    const link = await db("task_attachments")
      .where({ task_id: taskId, attachment_id: attachmentId })
      .first();
    return !!link;
  } catch (err) {
    throw err;
  }
};

const linkAttachmentToMessage = async (messageId, attachmentId, attachedBy) => {
  try {
    const [link] = await db("message_attachments")
      .insert({ message_id: messageId, attachment_id: attachmentId, attached_by: attachedBy })
      .returning("*");
    return link;
  } catch (err) {
    throw err;
  }
};

const getAttachmentsByMessageId = async (messageId) => {
  try {
    return await db("message_attachments as ma")
      .join("storage_attachments as sa", "ma.attachment_id", "sa.id")
      .where("ma.message_id", messageId)
      .select(
        "sa.id",
        "sa.supabase_path",
        "sa.original_name",
        "sa.mime_type",
        "sa.size_bytes",
        "sa.uploaded_by as attachment_uploader",
        "sa.created_at as attachment_created_at",
        "ma.attached_by as message_linker",
        "ma.attached_at as message_linked_at"
      )
      .orderBy("ma.attached_at", "asc");
  } catch (err) {
    throw err;
  }
};

const isAttachmentLinkedToMessage = async (messageId, attachmentId) => {
  try {
    const link = await db("message_attachments")
      .where({ message_id: messageId, attachment_id: attachmentId })
      .first();
    return !!link;
  } catch (err) {
    throw err;
  }
};

const isAttachmentStillLinked = async (attachmentId) => {
  try {
    const taskLink = await db("task_attachments").where({ attachment_id: attachmentId }).first();
    if (taskLink) return true;
    const messageLink = await db("message_attachments").where({ attachment_id: attachmentId }).first();
    if (messageLink) return true;
    return false;
  } catch (err) {
    throw err;
  }
};

export default {
  createAttachment,
  getAttachmentById,
  deleteAttachmentRecord,
  linkAttachmentToTask,
  getAttachmentsByTaskId,
  isAttachmentLinkedToTask,
  linkAttachmentToMessage,
  getAttachmentsByMessageId,
  isAttachmentLinkedToMessage,
  isAttachmentStillLinked,
};
