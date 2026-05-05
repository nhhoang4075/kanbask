import { v4 as uuidv4 } from "uuid";

import { db } from "../../config/db.js";

const createOneUser = async ({ email, password_hash, first_name, last_name }) => {
  try {
    const userId = uuidv4();
    const [user] = await db("users")
      .insert({
        id: userId,
        email,
        password_hash,
        first_name,
        last_name
      })
      .returning("id");

    return user.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneUserById = async (id) => {
  try {
    const [user] = await db("users")
      .select("*", db.raw("first_name || ' ' || last_name as full_name"))
      .where({ id })
      .limit(1);

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneUserByEmail = async (email) => {
  try {
    const [user] = await db("users")
      .select("*", db.raw("first_name || ' ' || last_name as full_name"))
      .where({ email })
      .limit(1);

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneUserByPasswordResetCode = async (code) => {
  try {
    const [user] = await db("users")
      .select("*", db.raw("first_name || ' ' || last_name as full_name"))
      .where({ password_reset_code: code })
      .limit(1);

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getAllUsers = async () => {
  try {
    const users = await db("users")
      .select("*", db.raw("first_name || ' ' || last_name as full_name"))
      .orderBy("created_at", "desc");
    return users;
  } catch (err) {
    throw new Error(err);
  }
};

const updateOneUserById = async (id, updateData) => {
  try {
    const [user] = await db("users")
      .where({ id })
      .update({ ...updateData, updated_at: new Date().toISOString() })
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
