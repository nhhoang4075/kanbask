import { v4 as uuidv4 } from "uuid";

import { db } from "../../config/db.js";

import pgvector from "pgvector/knex";

const createOneUser = async (data) => {
  try {
    const userId = uuidv4();
    const [user] = await db("users")
      .insert({
        id: userId,
        ...data,
        embedding: pgvector.toSql(data.embedding)
      })
      .returning("id");

    return user.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneUserById = async (id) => {
  try {
    const [user] = await db("users").select("*").where({ id }).limit(1);

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneUserByEmail = async (email) => {
  try {
    const [user] = await db("users").select("*").where({ email }).limit(1);

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneUserByPasswordResetCode = async (code) => {
  try {
    const [user] = await db("users").select("*").where({ password_reset_code: code }).limit(1);

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getAllUsers = async () => {
  try {
    const users = await db("users").select("*").orderBy("created_at", "desc");

    return users;
  } catch (err) {
    throw new Error(err);
  }
};

const updateOneUserById = async (id, updateData) => {
  try {
    const finalUpdate = {
      ...updateData,
      updated_at: db.fn.now()
    };

    if ("embedding" in finalUpdate) {
      finalUpdate.embedding = pgvector.toSql(finalUpdate.embedding);
    }

    const [user] = await db("users")
      .where({ id })
      .update({
        ...finalUpdate
      })
      .returning("id");

    return user.id;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneUserById = async (id) => {
  try {
    const [user] = await db("users").delete().where({ id }).returning("id");

    return user.id;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneUser,
  getOneUserById,
  getOneUserByEmail,
  getOneUserByPasswordResetCode,
  getAllUsers,
  updateOneUserById,
  deleteOneUserById
};
