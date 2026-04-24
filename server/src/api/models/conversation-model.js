import { sql } from "../../config/db.js";

/**
 * Creates a new conversation in the database.
 *
 * @async
 * @function createOneConversation
 * @param {Object} params - The parameters for creating a conversation.
 * @param {string} params.type - The type of the conversation (e.g., "group").
 * @throws {Error} If the database operation fails.
 * @returns {Promise<Object>} The created conversation object.
 *
 * @example
 * const conversation = await createOneConversation({ type: "group" });
 * console.log(conversation); // Logs the created conversation.
 */
const createOneConversation = async ({ type }) => {
  try {
    const [conversation] = await sql`
      INSERT INTO conversations (type)
      VALUES (${type})
      RETURNING *
    `;

    return conversation;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Adds multiple participants to a conversation.
 *
 * @async
 * @function addParticipantsToConversation
 * @param {Object} params - The parameters for adding participants.
 * @param {number} params.conversationId - The ID of the conversation.
 * @param {Array<number>} params.userIds - An array of user IDs to add as participants.
 * @throws {Error} If the database operation fails.
 * @returns {Promise<Array>} An array of participant objects that were added.
 *
 * @example
 * const participants = await addParticipantsToConversation({ conversationId: 1, userIds: [2, 3] });
 * console.log(participants); // Logs the added participants.
 */
const addParticipantsToConversation = async (conversationId, userIds) => {
  try {
    const participants = [];
    for (const userId of userIds) {
      const [participant] = await sql`
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES (${conversationId}, ${userId})
        RETURNING *
      `;
      participants.push(participant);
    }

    return participants;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Retrieves all conversations for a specific user.
 *
 * @async
 * @function getManyConversationsByUserId
 * @param {number} userId - The ID of the user whose conversations are being retrieved.
 * @throws {Error} If the database operation fails.
 * @returns {Promise<Array>} An array of conversation objects associated with the user.
 *
 * @example
 * const conversations = await getManyConversationsByUserId(1);
 * console.log(conversations); // Logs an array of conversations.
 */
const getManyConversationsByUserId = async (userId) => {
  try {
    const conversations = await sql`
      SELECT c.*
      FROM conversations c
      JOIN conversation_participants cp ON cp.conversation_id = c.id
      WHERE cp.user_id = ${userId}
      ORDER BY c.last_message_at DESC NULLS LAST
    `;

    return conversations;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneConversation,
  addParticipantsToConversation,
  getManyConversationsByUserId,
};
