import pgvector from "pgvector/knex";

import { db } from "../../config/db.js";

const searchUsersByVector = async (team_ids, search_term, query_vector, options = {}) => {
  try {
    const { limit = 10, offset = 0 } = options;
    const minSimilarity = 0.5;

    const qLike = `%${search_term}%`;
    const queryVectorSql = pgvector.toSql(query_vector);

    const users = await db("users")
      .select(
        "id",
        "email",
        "full_name",
        "avatar_url",
        db.raw("CASE WHEN full_name ILIKE ? OR email ILIKE ? THEN 1 ELSE 0 END AS fulltext", [
          qLike,
          qLike
        ]),
        db.raw("1 - (embedding <=> ?) AS similarity", [queryVectorSql])
      )
      .whereIn("id", function () {
        this.select("user_id").from("team_members").whereIn("team_id", team_ids);
      })
      .andWhere(function () {
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

const searchTasksByVector = async (
  project_ids,
  search_term,
  query_vector,
  filters = {},
  options = {}
) => {
  try {
    const { limit = 10, offset = 0 } = options;
    const { status } = filters;
    const minSimilarity = 0.5;

    const qLike = `%${search_term}%`;
    const queryVectorSql = pgvector.toSql(query_vector);

    const tasks = await db("tasks")
      .select(
        "id",
        "project_id",
        "title",
        "status",
        "created_at",
        db.raw("CASE WHEN title ILIKE ? THEN 1 ELSE 0 END AS full_text", [qLike]),
        db.raw("1 - (embedding <=> ?) AS similarity", [queryVectorSql])
      )
      .whereIn("project_id", project_ids)
      .andWhere(function () {
        if (status && status !== "all") {
          this.where("status", status);
        }
      })
      .andWhere(function () {
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

const searchMessagesByVector = async (conversation_id, search_term, query_vector, options = {}) => {
  try {
    const { limit = 10, offset = 0 } = options;
    const minSimilarity = 0.5;

    const qLike = `%${search_term}%`;
    const queryVectorSql = pgvector.toSql(query_vector);

    const messages = await db("messages AS m")
      .leftJoin("user_public_view AS v", "m.sender_id", "=", "v.id")
      .select(
        "m.id",
        "m.conversation_id",
        "m.sender_id",
        "v.full_name AS sender_full_name",
        "v.avatar_url AS sender_avatar_url",
        "m.content",
        "m.created_at",
        db.raw("CASE WHEN content ILIKE ? THEN 1 ELSE 0 END AS fulltext", [qLike]),
        db.raw("1 - (embedding <=> ?) AS similarity", [queryVectorSql])
      )
      .where({ conversation_id })
      .andWhere(function () {
        this.where("m.content", "ILIKE", qLike).orWhere(
          db.raw("1 - (m.embedding <=> ?) >= ?", [queryVectorSql, minSimilarity])
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
  searchTasksByVector,
  searchMessagesByVector
};
