import pgvector from "pgvector/knex";

import { db } from "../../config/db.js";

const createOneMessage = async ({ conversation_id, sender_id, content, embedding }) => {
  try {
    const [message] = await db("messages")
      .insert({
        conversation_id,
        sender_id,
        content,
        embedding: pgvector.toSql(embedding)
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
      .leftJoin("user_public_view AS v", "messages.sender_id", "=", "v.id")
      .select("messages.*", "v.full_name AS sender_full_name", "v.avatar_url AS sender_avatar_url")
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
      .leftJoin("user_public_view AS v", "messages.sender_id", "=", "v.id")
      .select("messages.*", "v.full_name AS sender_full_name", "v.avatar_url AS sender_avatar_url")
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
        content: data.content,
        embedding: pgvector.toSql(data.embedding),
        updated_at: db.fn.now()
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
