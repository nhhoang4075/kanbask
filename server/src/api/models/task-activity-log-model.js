import { db } from "../../config/db.js";

const createOneTaskActivityLog = async (data) => {
  try {
    const [log] = await db("task_activity_logs").insert(data).returning("id");

    return log.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneTaskActivityLogById = async (id) => {
  try {
    const [log] = await db("task_activity_logs AS l")
      .leftJoin("tasks AS t", "t.id", "=", "l.task_id")
      .join("user_public_view AS v", "v.id", "=", "l.user_id")
      .select([
        "l.id",
        "l.task_id",
        "t.title",
        "l.user_id",
        "v.full_name",
        "v.avatar_url",
        "l.action",
        "l.details",
        "l.created_at"
      ])
      .where("l.id", id)
      .orderBy("l.created_at", "asc");

    return log;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyTaskActivityLogsByTaskId = async (task_id) => {
  try {
    const logs = await db("task_activity_logs AS l")
      .join("tasks AS t", "t.id", "=", "l.task_id")
      .join("user_public_view AS v", "v.id", "=", "l.user_id")
      .select([
        "l.id",
        "l.task_id",
        "t.title",
        "l.user_id",
        "v.full_name",
        "v.avatar_url",
        "l.action",
        "l.details",
        "l.created_at"
      ])
      .where("l.task_id", task_id)
      .orderBy("l.created_at", "asc");

    return logs;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyTaskActivityLogsByProjectId = async (project_id) => {
  try {
    const logs = await db("task_activity_logs AS l")
      .leftJoin("tasks AS t", "t.id", "=", "l.task_id")
      .join("user_public_view AS v", "v.id", "=", "l.user_id")
      .select([
        "l.id",
        "l.task_id",
        "t.title",
        "l.user_id",
        "v.full_name",
        "v.avatar_url",
        "l.action",
        "l.details",
        "l.created_at"
      ])
      .where("t.project_id", project_id)
      .orWhereNull("l.task_id")
      .orderBy("l.created_at", "asc");

    return logs;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneTaskActivityLog,
  getOneTaskActivityLogById,
  getManyTaskActivityLogsByTaskId,
  getManyTaskActivityLogsByProjectId
};
