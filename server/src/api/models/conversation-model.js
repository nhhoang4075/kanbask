import { sql } from "../../config/db.js";

/**
 * Creates a new conversation and adds participants to it.
 *
 * @async
 * @function createOneConversation
 * @param {Object} params - The parameters for creating a conversation.
 * @param {string} params.type - The type of the conversation (e.g., "group").
 * @param {Array<number>} params.userIds - An array of user IDs to be added as participants.
 * @throws {Error} Throws an error if the operation fails.
 * @returns {Promise<Object>} An object containing the ID of the created conversation.
 *
 * @example
 * const result = await createOneConversation({ type: "group", userIds: [1, 2, 3] });
 * console.log(result.conversationId); // Outputs the ID of the created conversation.
 */
const createOneConversation = async ({ type, userIds }) => {
  try {
    const [conversation] = await sql`
      INSERT INTO conversations (type)
      VALUES (${type})
      RETURNING *
    `;
    const conversationId = conversation.id;

    for (const userId of userIds) {
      await sql`
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES (${conversationId}, ${userId})
      `;
    }

    return { conversationId };
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Retrieves all conversations associated with a specific user by their user ID.
 *
 * @async
 * @function getManyConversationsByUserId
 * @param {number} userId - The ID of the user whose conversations are to be retrieved.
 * @throws {Error} Throws an error if the operation fails.
 * @returns {Promise<Array>} An array of conversation objects associated with the user.
 *
 * @example
 * const conversations = await getManyConversationsByUserId(1);
 * console.log(conversations); // Outputs an array of conversations.
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
  getManyConversationsByUserId,
};
