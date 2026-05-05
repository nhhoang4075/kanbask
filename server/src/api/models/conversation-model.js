import { db } from "../../config/db.js";

const createOneConversation = async (type, team_id, project_id) => {
  try {
    const [conversation] = await db("conversations")
      .insert({
        type,
        team_id,
        project_id
      })
      .returning("id");

    return conversation.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneConversationById = async (id) => {
  try {
    const [conversation] = await db("conversations").select("*").where({ id }).limit(1);

    return conversation;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneConversationByTeamId = async (team_id) => {
  try {
    const [conversation] = await db("conversations")
      .select("*")
      .where({ type: "team", team_id })
      .limit(1);

    return conversation;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneConversationByProjectId = async (project_id) => {
  try {
    const [conversation] = await db("conversations")
      .select("*")
      .where({ type: "project", project_id })
      .limit(1);

    return conversation;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyConversationsByUserId = async (user_id) => {
  try {
    const conversations = await db("conversations AS c")
      .leftJoin("teams AS t", "c.team_id", "t.id")
      .leftJoin("projects AS p", "c.project_id", "p.id")
      .join("conversation_participants AS cp", "cp.conversation_id", "c.id")
      .select(
        "c.id",
        "c.type",
        db.raw(
          `CASE
            WHEN c.type = 'direct' THEN (
              SELECT u.first_name || ' ' || u.last_name
              FROM conversation_participants AS cp2
              JOIN users AS u ON cp2.user_id = u.id
              WHERE cp2.conversation_id = c.id
                AND u.id <> ?
              LIMIT 1
            )
            WHEN c.type = 'team' THEN t.name
            WHEN c.type = 'project' THEN p.name
          END AS title`,
          [user_id]
        ),
        "c.team_id",
        "c.project_id",
        "c.last_message_at",
        "c.created_at"
      )
      .where("cp.user_id", user_id)
      .orderByRaw("COALESCE(c.last_message_at, c.created_at) DESC");

    return conversations;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneConversationById = async (id) => {
  try {
    const [conversation] = await db("conversations").delete().where({ id }).returning("id");

    return conversation.id;
  } catch (err) {
    throw new Error(err);
  }
};

const addParticipantsToConversation = async (conversation_id, user_ids) => {
  try {
    for (const user_id of user_ids) {
      await db("conversation_participants").insert({ conversation_id, user_id });
    }

    return conversation_id;
  } catch (err) {
    throw new Error(err);
  }
};

const getParticipantsOfConversation = async (conversation_id) => {
  try {
    const participants = await db("conversation_participants")
      .select("*")
      .where({ conversation_id });

    return participants;
  } catch (err) {
    throw new Error(err);
  }
};

const removeParticipantsFromConversation = async (conversation_id, user_ids) => {
  try {
    for (const user_id of user_ids) {
      await db("conversation_participants").delete().where({ conversation_id, user_id });
    }

    return conversation_id;
  } catch (err) {
    throw new Error(err);
  }
};

const countUnreadMessagesByUserId = async (user_id) => {
  try {
    const [unreadCount] = await db("conversation_participants AS cp")
      .join("messages AS m", "m.conversation_id", "=", "cp.conversation_id")
      .select("cp.conversation_id")
      .count("m.id AS unread_count")
      .where("cp.user_id", user_id)
      .andWhere("m.created_at", ">", db.raw("COALESCE(cp.last_read_at, '1970-01-01'::timestamp)"))
      .groupBy("cp.conversation_id");

    return unreadCount;
  } catch (err) {
    throw new Error(err);
  }
};

const updateLastReadMessage = async (conversation_id, user_id, message_id) => {
  try {
    await db("conversation_participants").where({ conversation_id, user_id }).update({
      last_read_message_id: message_id,
      last_read_at: new Date().toISOString()
    });

    return user_id;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneConversation,
  getOneConversationById,
  getOneConversationByTeamId,
  getOneConversationByProjectId,
  getManyConversationsByUserId,
  deleteOneConversationById,
  addParticipantsToConversation,
  getParticipantsOfConversation,
  removeParticipantsFromConversation,
  countUnreadMessagesByUserId,
  updateLastReadMessage
};
