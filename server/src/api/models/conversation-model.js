import { db } from "../../config/db.js";

const createOneConversation = async (type, team_id, project_id) => {
  try {
    const [conversation] = await db("conversations")
      .insert({
        type,
        team_id,
        project_id
      })
      .returning("*");

    return conversation;
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
    const conversations = await db("conversations as c")
      .select(
        "c.id",
        "c.type",
        db.raw(
          `CASE
            WHEN c.type = 'direct' THEN (
              SELECT u.first_name || ' ' || u.last_name
              FROM conversation_participants as cp2
              JOIN users as u ON cp2.user_id = u.id
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
      .leftJoin("teams as t", "c.team_id", "t.id")
      .leftJoin("projects as p", "c.project_id", "p.id")
      .join("conversation_participants as cp", "cp.conversation_id", "c.id")
      .where("cp.user_id", user_id)
      .orderByRaw("COALESCE(c.last_message_at, c.created_at) DESC");

    return conversations;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneConversationById = async (id) => {
  try {
    const [deletedConversation] = await db("conversations").delete().where({ id }).returning("*");

    return deletedConversation;
  } catch (err) {
    throw new Error(err);
  }
};

const addParticipantsToConversation = async (conversation_id, user_ids) => {
  try {
    const participants = [];
    for (const user_id of user_ids) {
      const [participant] = await db("conversation_participants")
        .insert({ conversation_id, user_id })
        .returning("*");

      participants.push(participant);
    }

    return participants;
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
    const removedUsers = [];
    for (const user_id of user_ids) {
      const [user] = await db("conversation_participants")
        .delete()
        .where({ conversation_id, user_id })
        .returning("*");

      removedUsers.push(user);
    }

    return removedUsers;
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
  removeParticipantsFromConversation
};
