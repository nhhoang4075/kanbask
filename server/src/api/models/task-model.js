import { db } from "../../config/db.js";

const createTask = async (project_id, title, status, priority, assignees, created_by, due_date) => {
  try {
    return await db.transaction(async (trx) => {
      const [task] = await trx("tasks")
        .insert({
          project_id,
          title,
          status,
          priority,
          created_by,
          due_date
        })
        .returning("*");

      if (assignees.length) {
        const rows = assignees.map((user_id) => ({
          user_id,
          task_id: task.id
        }));
        await trx("user_tasks").insert(rows);
      }

      task.assignees = assignees;
      return task;
    });
  } catch (error) {
    throw new Error(error);
  }
};

const updateTask = async (task_id, title, status, priority, assignees, due_date) => {
  return await db.transaction(async (trx) => {
    await trx("tasks")
      .where({
        id: task_id
      })
      .update({
        title: db.raw("COALESCE(?, title", [title]),
        status: db.raw("COALESCE(?, status", [status]),
        priority: db.raw("COALESCE(?, priority", [priority]),
        due_date: db.raw("COALESCE(?, due_date", [due_date])
      });

    if (assignees) {
      await trx("user_tasks")
        .where({
          id: task_id
        })
        .del();

      if (assignees.length) {
        const rows = assignees.map((user_id) => ({
          user_id,
          task_id
        }));
        trx("user_tasks").insert(rows);
      }
    }
  });
};

export default {
  createTask,
  updateTask
};
