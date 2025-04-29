import {db }from "../../config/db.js";

const createOneComment = async ({ task_id, user_id, content }) => {
  const [comment] = await db("task_comments")
    .insert({
      task_id,
      user_id,
      content,
      created_at: new Date()
    })
    .returning("id");


  return comment?.id;
};


const getOneCommentById = async (id) => {
  return db("task_comments").where({ id }).first();
};

const getUserIdByCommentId = async (id) => {
  const result = await db("task_comments")
    .select("user_id")
    .where({ id})
    .first();

  return result?.user_id || null;
};

const getCommentsByTaskId = async (task_id) => {
  return db("task_comments")
    .select("id", "task_id", "user_id", "content", "created_at")
    .where({ task_id })
    .orderBy("created_at", "asc");
};


const updateOneCommentById = async (id, content) => {
    const [updated] = await db("task_comments")
      .where({ id })
      .update({ content }) // content phải là string
      .returning("id");
 
    return updated?.id;
  };


const deleteOneCommentById = async (id) => {
  return db("task_comments").where({ id }).del();
};


export default {
  createOneComment,
  getOneCommentById,
  getCommentsByTaskId,
  updateOneCommentById,
  deleteOneCommentById,
  getUserIdByCommentId
};
