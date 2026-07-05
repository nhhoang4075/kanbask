import pgvector from "pgvector/knex";

import { db } from "../../config/db.js";

const createOneUser = async (data) => {
  try {
    const [user] = await db("users")
      .insert({
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

const getManyUsersPaginated = async (q, { limit, offset }) => {
  try {
    const query = db("users").select("*").orderBy("created_at", "desc").limit(limit).offset(offset);

    if (q) {
      query.where((builder) => {
        builder.whereILike("full_name", `%${q}%`).orWhereILike("email", `%${q}%`);
      });
    }

    return await query;
  } catch (err) {
    throw new Error(err);
  }
};

const countUsers = async (q) => {
  try {
    const query = db("users");

    if (q) {
      query.where((builder) => {
        builder.whereILike("full_name", `%${q}%`).orWhereILike("email", `%${q}%`);
      });
    }

    const [{ count }] = await query.count("id AS count");

    return parseInt(count, 10);
  } catch (err) {
    throw new Error(err);
  }
};

const getAllCreatedAtTimestamps = async () => {
  try {
    return await db("users").select("created_at");
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
  getManyUsersPaginated,
  countUsers,
  getAllCreatedAtTimestamps,
  updateOneUserById,
  deleteOneUserById
};
