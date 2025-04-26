import { db } from "../../config/db.js";

const createOneMessage = async ({ conversation_id, sender_id, content }) => {
  try {
    const [message] = await db("messages")
      .insert({
        conversation_id,
        sender_id,
        content
      })
      .returning("id");

    return message.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneMessageById = async (id) => {
  try {
    const [message] = await db("messages")
      .leftJoin("users", "messages.sender_id", "=", "users.id")
      .select(
        "messages.*",
        db.raw("users.first_name || ' ' || users.last_name AS sender_full_name"),
        "users.avatar_url AS sender_avatar_url"
      )
      .where("messages.id", id)
      .limit(1);

    return message;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyMessagesByConversationId = async (conversation_id) => {
  try {
    const messages = await db("messages")
      .leftJoin("users", "messages.sender_id", "=", "users.id")
      .select(
        "messages.*",
        db.raw("users.first_name || ' ' || users.last_name AS sender_full_name"),
        "users.avatar_url AS sender_avatar_url"
      )
      .where({ conversation_id })
      .orderBy("messages.created_at", "asc");

    return messages;
  } catch (err) {
    throw new Error(err);
  }
};

const updateOneMessageById = async (id, data) => {
  try {
    const [message] = await db("messages")
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .where({ id })
      .returning("id");

    return message.id;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneMessageById = async (id) => {
  try {
    const [message] = await db("messages").delete().where({ id }).returning("id");

    return message.id;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneMessage,
  getOneMessageById,
  getManyMessagesByConversationId,
  updateOneMessageById,
  deleteOneMessageById
};
