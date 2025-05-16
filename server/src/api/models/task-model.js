import { db } from "../../config/db.js";
import pgvector from "pgvector/knex";

import embeddingProvider from "../../config/embedding-provider.js";

const createOneTask = async (user_id, data, position, assignees) => {
  try {
    return await db.transaction(async (trx) => {
      const textToEmbed = data.title.trim();
      const taskEmbedding = await embeddingProvider.generateEmbedding(textToEmbed);
      const embedding = pgvector.toSql(taskEmbedding);

      const [task] = await trx("tasks")
        .insert({
          ...data,
          created_by: user_id,
          position,
          embedding
        })
        .returning("*");

      if (assignees.length) {
        const rows = assignees.map((user_id) => ({
          user_id,
          task_id: task.id
        }));
        await trx("task_assignees").insert(rows);
      }

      task.assignees = assignees;
      return task;
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getProjectTasks = async (project_id) => {
  try {
    const tasks = db("tasks").where({ project_id }).orderBy("position", "asc");
    return tasks;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneTaskById = async (task_id) => {
  try {
    const task = await db("tasks").where({ id: task_id }).first();
    return task;
  } catch (err) {
    throw new Error(err);
  }
};

const getMaxTaskPosition = async (project_id) => {
  const [{ max }] = await db("tasks").where({ project_id }).max("position as max");
  return max || 0;
};

const updateOneTaskById = async (task_id, data, assignees) => {
  try {
    return await db.transaction(async (trx) => {
      const updated_at = trx.fn.now();

      if (data.status === "done") data.completed_at = trx.fn.now();
      else if (data.status != null) data.completed_at = null;

      const [updatedTask] = await trx("tasks")
        .where({ id: task_id })
        .update({ ...data, updated_at })
        .returning("*");

      if (assignees) {
        await trx("task_assignees").where({ task_id }).del();
        if (assignees.length) {
          const rows = assignees.map((user_id) => ({
            user_id,
            task_id
          }));
          await trx("task_assignees").insert(rows);
        }
      }

      return updatedTask;
    });
  } catch (err) {
    throw new Error(err);
  }
};

const moveTask = async (id, project_id, old_position, new_position) => {
  try {
    return await db.transaction(async (trx) => {
      if (old_position < new_position) {
        await trx("tasks")
          .where({ project_id })
          .andWhere("position", "<=", new_position)
          .andWhere("position", ">", old_position)
          .decrement("position", 1);
      } else {
        await trx("tasks")
          .where({ project_id })
          .andWhere("position", ">=", new_position)
          .andWhere("position", "<", old_position)
          .increment("position", 1);
      }

      const [updated] = await trx("tasks")
        .where({ id })
        .update({ position: new_position })
        .returning("*");
      return updated;
    });
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneTaskById = async (id, project_id, position) => {
  try {
    await db.transaction(async (trx) => {
      await trx("tasks").where({ id }).del();

      await trx("tasks")
        .where({ project_id })
        .andWhere("position", ">", position)
        .decrement("position", 1);
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneTask,
  getProjectTasks,
  getOneTaskById,
  getMaxTaskPosition,
  updateOneTaskById,
  moveTask,
  deleteOneTaskById
};
