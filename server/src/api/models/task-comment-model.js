import { db } from "../../config/db.js";

const createOneTaskComment = async (data) => {
  try {
    const [comment] = await db("task_comments").insert(data).returning("id");

    return comment.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneTaskCommentById = async (id) => {
  try {
    const [comment] = await db("task_comments AS tc")
      .join("user_public_view AS v", "v.id", "=", "tc.user_id")
      .select(
        "tc.id",
        "tc.task_id",
        "tc.content",
        "tc.user_id as commenter_id",
        "v.full_name as commenter_full_name",
        "v.avatar_url as commenter_avatar_url",
        "tc.created_at",
        "tc.updated_at"
      )
      .where("tc.id", id)
      .limit(1);

    return comment;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyTaskCommentsByTaskId = async (task_id) => {
  try {
    const comments = await db("task_comments AS tc")
      .join("user_public_view AS v", "v.id", "=", "tc.user_id")
      .select(
        "tc.id",
        "tc.task_id",
        "tc.content",
        "tc.user_id as commenter_id",
        "v.full_name as commenter_full_name",
        "v.avatar_url as commenter_avatar_url",
        "tc.created_at",
        "tc.updated_at"
      )
      .where("tc.task_id", task_id)
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
      .update({ ...data, updated_at: db.fn.now() })
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
