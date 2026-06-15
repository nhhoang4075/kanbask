import { db } from "../../config/db.js";

const createOneActivityLog = async (data) => {
  try {
    const [log] = await db("activity_logs").insert(data).returning("*");
    return log;
  } catch (err) {
    throw new Error(err);
  }
};

const getActivityLogsOfUser = async (user_id) => {
  try {
    const logs = await db("activity_logs")
      .select("*")
      .where({ user_id })
      .orderBy("created_at", "desc");
    return logs;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneActivityLogById = async (id) => {
  try {
    const log = await db("activity_logs").where({ id }).first();
    return log;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneActivityLogById = async (id) => {
  try {
    await db("activity_logs").where({ id }).del().returning("*");
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneActivityLog,
  getActivityLogsOfUser,
  getOneActivityLogById,
  deleteOneActivityLogById
};
