import { db } from "../../config/db.js";
import pgvector from "pgvector/knex";

const searchUsersByVector = async (userId, searchTerm, queryVector, options = {}) => {
  const { limit = 10, offset = 0 } = options;
  const minSimilarity = 0.5;

  try {
    const userTeams = await db("team_members").select("team_id").where("user_id", userId);
    const teamIds = userTeams.map((t) => t.team_id);
    if (teamIds.length === 0) return [];

    const qLike = `%${searchTerm}%`;
    const queryVectorSql = pgvector.toSql(queryVector);

    const users = await db("users")
      .select(
        "users.id",
        "email",
        "full_name",
        db.raw("CASE WHEN full_name ILIKE ? OR email ILIKE ? THEN 1 ELSE 0 END AS fulltext", [
          qLike,
          qLike
        ]),
        db.raw("1 - (embedding <=> ?) AS similarity", [queryVectorSql])
      )
      .whereIn("users.id", function () {
        this.select("user_id").from("team_members").whereIn("team_id", teamIds);
      })
      .whereNot("users.id", userId)
      .where(function () {
        this.where("full_name", "ILIKE", qLike)
          .orWhere("email", "ILIKE", qLike)
          .orWhere(db.raw("1 - (embedding <=> ?) >= ?", [queryVectorSql, minSimilarity]));
      })
      .orderBy("fulltext", "desc")
      .orderBy("similarity", "desc")
      .limit(limit)
      .offset(offset);

    return users;
  } catch (err) {
    throw err;
  }
};

const searchMyTasksByVector = async (
  userId,
  searchTerm,
  queryVector,
  filters = {},
  options = {}
) => {
  const { limit = 10, offset = 0 } = options;
  const { status } = filters;
  const minSimilarity = 0.5;

  try {
    const queryVectorSql = pgvector.toSql(queryVector);
    const qLike = `%${searchTerm}%`;

    const tasks = await db("tasks")
      .select(
        "tasks.id",
        "tasks.project_id",
        "tasks.title",
        "tasks.status",
        "tasks.created_at",
        db.raw("CASE WHEN title ILIKE ? THEN 1 ELSE 0 END AS fulltext", [qLike]),
        db.raw("1 - (embedding <=> ?) as similarity", [queryVectorSql])
      )
      .whereIn("tasks.id", db("task_assignees").select("task_id").where("user_id", userId))
      .andWhere(function () {
        if (status && status !== "all") {
          this.where("tasks.status", status);
        }
      })
      .where(function () {
        this.where("title", "ILIKE", qLike).orWhere(
          db.raw("1 - (embedding <=> ?) >= ?", [queryVectorSql, minSimilarity])
        );
      })
      .orderBy("fulltext", "desc")
      .orderBy("similarity", "desc")
      .limit(limit)
      .offset(offset);

    return tasks;
  } catch (err) {
    throw err;
  }
};

const searchMessagesByVector = async (conversationId, searchTerm, queryVector, options = {}) => {
  const { limit = 10, offset = 0 } = options;
  const minSimilarity = 0.5;

  try {
    const qLike = `%${searchTerm}%`;
    const queryVectorSql = pgvector.toSql(queryVector);

    const messages = await db("messages")
      .select(
        "messages.id",
        "messages.conversation_id",
        "messages.sender_id",
        "messages.content",
        "messages.created_at",
        "messages.updated_at",
        db.raw("CASE WHEN content ILIKE ? THEN 1 ELSE 0 END AS fulltext", [qLike]),
        db.raw("1 - (embedding <=> ?) as similarity", [queryVectorSql])
      )
      .whereIn(
        "messages.sender_id",
        db("conversation_participants").select("user_id").where("conversation_id", conversationId)
      )
      .andWhere("messages.conversation_id", conversationId)
      .where(function () {
        this.where("content", "ILIKE", qLike).orWhere(
          db.raw("1 - (embedding <=> ?) >= ?", [queryVectorSql, minSimilarity])
        );
      })
      .orderBy("fulltext", "desc")
      .orderBy("similarity", "desc")
      .limit(limit)
      .offset(offset);

    return messages;
  } catch (err) {
    throw err;
  }
};

export default {
  searchUsersByVector,
  searchMyTasksByVector,
  searchMessagesByVector
};
