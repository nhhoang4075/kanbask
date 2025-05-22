import pgvector from "pgvector/knex";

import { db } from "../../config/db.js";

const createOneMessage = async (data) => {
  try {
    const [message] = await db("messages")
      .insert({
        ...data,
        embedding: pgvector.toSql(data.embedding)
      })
      .returning("id");

    return message.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneMessageById = async (id) => {
  try {
    const [message] = await db("messages AS m")
      .leftJoin("user_public_view AS v", "v.id", "=", "m.sender_id")
      .select(
        "m.id",
        "m.conversation_id",
        "m.sender_id",
        "v.full_name AS sender_full_name",
        "v.avatar_url AS sender_avatar_url",
        "m.content",
        "m.created_at",
        "m.updated_at"
      )
      .where("m.id", id)
      .limit(1);

    return message;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyMessagesByConversationId = async (conversation_id) => {
  try {
    const messages = await db("messages AS m")
      .leftJoin("user_public_view AS v", "v.id", "=", "m.sender_id")
      .select(
        "m.id",
        "m.conversation_id",
        "m.sender_id",
        "v.full_name AS sender_full_name",
        "v.avatar_url AS sender_avatar_url",
        "m.content",
        "m.created_at",
        "m.updated_at"
      )
      .where("m.conversation_id", conversation_id)
      .orderBy("m.created_at", "asc");

    // console.log("messages", messages);

    return messages;
  } catch (err) {
    throw new Error(err);
  }
};

const isUserMessageSender = async (message_id, user_id) => {
  try {
    const [record] = await db("messages").where({ id: message_id, sender_id: user_id }).limit(1);

    return !!record;
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
  isUserMessageSender,
  updateOneMessageById,
  deleteOneMessageById
};
