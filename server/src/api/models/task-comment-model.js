import { db } from "../../config/db.js";

const createOneTaskComment = async (data) => {
  try {
    const [comment] = await db("task_comments")
      .insert({ ...data })
      .returning("id");

    return comment.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneTaskCommentById = async (id) => {
  try {
    const [comment] = await db("task_comments").where({ id }).limit(1);

    return comment;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyTaskCommentsByTaskId = async (task_id) => {
  try {
    const comments = await db("task_comments")
      .select("*")
      .where({ task_id })
      .orderBy("created_at", "asc");

    return comments;
  } catch (err) {
    throw new Error(err);
  }
};

const updateOneTaskCommentById = async (id, data) => {
  try {
    const [comment] = await db("task_comments")
      .where({ id })
      .update({ ...data })
      .returning("id");

    return comment?.id;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneTaskCommentById = async (id) => {
  try {
    const [comment] = await db("task_comments").delete().where({ id }).returning("id");

    return comment.id;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneTaskComment,
  getOneTaskCommentById,
  getManyTaskCommentsByTaskId,
  updateOneTaskCommentById,
  deleteOneTaskCommentById
};
