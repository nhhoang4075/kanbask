import { db } from "../../config/db.js";

const createOneTask = async (
  project_id,
  title,
  status,
  priority,
  due_date,
  position,
  created_by,
  assignees
) => {
  try {
    return await db.transaction(async (trx) => {
      const [task] = await trx("tasks")
        .insert({
          project_id,
          title,
          status,
          priority,
          due_date,
          position,
          created_by
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

const updateOneTaskInfo = async (task_id, title, status, priority, due_date, assignees) => {
  try {
    return await db.transaction(async (trx) => {
      const updateData = {
        updated_at: trx.fn.now()
      };
      if (title !== undefined) updateData.title = title;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (due_date !== undefined) updateData.due_date = due_date;
      if (status === "done") updateData.completed_at = trx.fn.now();

      const [updatedTask] = await trx("tasks")
        .where({ id: task_id })
        .update(updateData)
        .returning("*");

      if (assignees) {
        await trx("task_assignees").where({ task_id }).del();
        if (assignees.length) {
          const rows = assignees.map((user_id) => ({
            user_id,
            task_id,
            assigned_at: trx.fn.now()
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

const updateOneTaskPosition = async (id, project_id, old_position, new_position) => {
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
  updateOneTaskInfo,
  updateOneTaskPosition,
  deleteOneTaskById
};
