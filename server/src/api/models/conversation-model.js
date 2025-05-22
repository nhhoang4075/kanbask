import { db } from "../../config/db.js";

const createOneConversation = async ({
  type,
  team_id = null,
  project_id = null,
  is_pending = false
}) => {
  try {
    const [conversation] = await db("conversations")
      .insert({
        type,
        team_id,
        project_id,
        is_pending
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
    const [conversation] = await db("conversations AS c")
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
      .join("conversation_participants AS cp", "cp.conversation_id", "=", "c.id")
      .select("c.*")
      .where("cp.user_id", user_id);

    return conversations;
  } catch (err) {
    throw new Error(err);
  }
};

const isUserInConversation = async (conversation_id, user_id) => {
  try {
    const [record] = await db("conversation_participants")
      .where({ conversation_id, user_id })
      .limit(1);

    return !!record;
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
    await db.transaction(async (trx) => {
      for (const user_id of user_ids) {
        await trx("conversation_participants").insert({ conversation_id, user_id });
      }
    });

    return conversation_id;
  } catch (err) {
    throw new Error(err);
  }
};

const getParticipantsOfConversation = async (conversation_id) => {
  try {
    const participants = await db("conversation_participants AS cp")
      .join("user_public_view AS v", "v.id", "=", "cp.user_id")
      .select("v.*")
      .where({ conversation_id });

    return participants;
  } catch (err) {
    throw new Error(err);
  }
};

const removeParticipantsFromConversation = async (conversation_id, user_ids) => {
  try {
    await db("conversation_participants AS cp")
      .delete()
      .whereIn("cp.user_id", user_ids)
      .andWhere({ conversation_id });

    return conversation_id;
  } catch (err) {
    throw new Error(err);
  }
};

const getDetailOfConversation = async (conversation_id, user_id) => {
  try {
    const [conversation] = await db("conversation_latest_activity_view AS v")
      .innerJoin("conversation_participants AS cp", function () {
        this.on("cp.conversation_id", "=", "v.conversation_id").andOn(
          "cp.user_id",
          "=",
          db.raw("?", [user_id])
        );
      })
      .leftJoin(
        db("messages AS m")
          .select("m.conversation_id", "cp.user_id")
          .count("m.id AS unread_count")
          .join("conversation_participants AS cp", "cp.conversation_id", "m.conversation_id")
          .where("m.sender_id", "!=", user_id)
          .andWhere(
            "m.created_at",
            ">",
            db.raw("COALESCE(cp.last_read_at, '1970-01-01'::timestamp)")
          )
          .groupBy("m.conversation_id", "cp.user_id")
          .as("um"),
        function () {
          this.on("um.conversation_id", "=", "v.conversation_id").andOn(
            "um.user_id",
            "=",
            "cp.user_id"
          );
        }
      )
      .select([
        "v.type",
        "v.team_id",
        "v.project_id",
        "v.latest_message_id",
        "v.latest_message_content",
        "v.latest_message_at",
        "v.latest_sender_id",
        "v.latest_sender_full_name",
        "cp.last_read_message_id",
        "cp.last_read_at",
        // Title based on type
        db.raw(
          `CASE
            WHEN v.type = 'direct' THEN (
              SELECT uv.full_name
              FROM conversation_participants cp2
              JOIN user_public_view uv ON cp2.user_id = uv.id
              WHERE cp2.conversation_id = v.conversation_id AND uv.id <> ?
              LIMIT 1
            )
            WHEN v.type = 'team' THEN (
              SELECT t.name
              FROM teams t
              WHERE t.id = v.team_id
            )
            WHEN v.type = 'project' THEN (
              SELECT p.name
              FROM projects p
              WHERE p.id = v.project_id
            )
          END AS title`,
          [user_id]
        ),
        // Avatar for direct
        db.raw(
          `CASE
            WHEN v.type = 'direct' THEN (
              SELECT uv.avatar_url
              FROM conversation_participants cp2
              JOIN user_public_view uv ON cp2.user_id = uv.id
              WHERE cp2.conversation_id = v.conversation_id AND uv.id <> ?
              LIMIT 1
            )
            ELSE NULL
          END AS avatar_url`,
          [user_id]
        ),
        db.raw(
          `(SELECT COUNT(*) 
            FROM conversation_participants cp3 
            WHERE cp3.conversation_id = v.conversation_id
          ) AS participant_count`
        ),
        db.raw("COALESCE(um.unread_count, 0) AS unread_count")
      ])
      .where("v.conversation_id", conversation_id)
      .limit(1);

    return conversation;
  } catch (err) {
    throw err;
  }
};

const updateConversationPendingStatus = async (conversation_id, is_pending) => {
  try {
    const [conversation] = await db("conversations")
      .where({ id: conversation_id })
      .update({ is_pending })
      .returning("id");

    return conversation.id;
  } catch (err) {
    throw new Error(err);
  }
};

const updateLastReadMessage = async (conversation_id, user_id, message_id) => {
  try {
    await db("conversation_participants").where({ conversation_id, user_id }).update({
      last_read_message_id: message_id,
      last_read_at: db.fn.now()
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
  isUserInConversation,
  deleteOneConversationById,
  addParticipantsToConversation,
  getParticipantsOfConversation,
  removeParticipantsFromConversation,
  getDetailOfConversation,
  updateConversationPendingStatus,
  updateLastReadMessage
};
