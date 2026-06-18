import { db } from "../../config/db.js";
import pgvector from "pgvector/knex";

const createOneTask = async (data, assignees) => {
  try {
    const task = await db.transaction(async (trx) => {
      const [task] = await trx("tasks")
        .insert({
          ...data,
          embedding: pgvector.toSql(data.embedding)
        })
        .returning("id");

      if (assignees && assignees.length) {
        const rows = assignees.map((user_id) => ({
          user_id,
          task_id: task.id
        }));
        await trx("task_assignees").insert(rows);
      }

      return task;
    });

    return task.id;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneTaskById = async (id) => {
  try {
    const [task] = await db("tasks")
      .select(
        "id",
        "project_id",
        "title",
        "status",
        "priority",
        "due_date",
        "completed_at",
        "position",
        "created_at",
        "updated_at"
      )
      .where({ id })
      .limit(1);

    return task;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyTasksByProjectId = async (project_id) => {
  try {
    const tasks = db("tasks")
      .select(
        "id",
        "project_id",
        "title",
        "status",
        "priority",
        "due_date",
        "completed_at",
        "position",
        "created_at",
        "updated_at"
      )
      .where({ project_id })
      .orderBy("position", "asc");

    return tasks;
  } catch (err) {
    throw new Error(err);
  }
};

const updateOneTaskById = async (id, data, assignees) => {
  try {
    await db.transaction(async (trx) => {
      await trx("tasks")
        .where({ id })
        .update({ ...data, updated_at: trx.fn.now() })
        .returning("id");

      if (assignees) {
        await trx("task_assignees").delete().where({ task_id: id });

        if (assignees.length) {
          const rows = assignees.map((user_id) => ({
            user_id,
            task_id: id
          }));

          await trx("task_assignees").insert(rows);
        }
      }
    });

    return id;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneTaskById = async (id) => {
  try {
    const task = await db.transaction(async (trx) => {
      const [task] = await trx("tasks").delete().where({ id }).returning("*");

      await trx("tasks")
        .where({ project_id: task.project_id })
        .andWhere("position", ">", task.position)
        .decrement("position", 1);

      await trx("task_assignees").delete().where({ task_id: id });

      return task;
    });

    return task.project_id;
  } catch (err) {
    throw new Error(err);
  }
};

const getAssigneesOfTask = async (task_id) => {
  try {
    const assignees = await db("task_assignees AS ta")
      .join("tasks AS t", "t.id", "=", "ta.task_id")
      .select("ta.user_id", "ta.assigned_at")
      .where({ task_id });

    return assignees;
  } catch (err) {
    throw new Error(err);
  }
};

const getMaxTaskPositionOfProject = async (project_id) => {
  try {
    const [{ max }] = await db("tasks").where({ project_id }).max("position AS max");

    return max || 0;
  } catch (err) {
    throw new Error(err);
  }
};

const moveTask = async (id, project_id, old_position, new_position) => {
  try {
    await db.transaction(async (trx) => {
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

      await trx("tasks").where({ id }).update({ position: new_position });
    });

    return id;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneTask,
  getOneTaskById,
  getManyTasksByProjectId,
  updateOneTaskById,
  deleteOneTaskById,
  getAssigneesOfTask,
  getMaxTaskPositionOfProject,
  moveTask
};
