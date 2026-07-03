import conversationService from "../api/services/conversation-service.js";

const registerConversationHandlers = (io, socket) => {
  socket.on("join_conversation", async ({ conversation_id }) => {
    try {
      const oldRoomId = socket.data?.conversation_id;
      const { id: user_id } = socket.data.user;

      // Handle room joining
      if (!oldRoomId) {
        socket.join(`conversation_${conversation_id}`);
      } else if (oldRoomId != conversation_id) {
        socket.leave(`conversation_${oldRoomId}`);
        socket.join(`conversation_${conversation_id}`);
      }

      // Get initial conversation state
      const conversation = await conversationService.getOneConversationById(
        conversation_id,
        user_id
      );

      // Only update last read if there are unread messages
      await conversationService.updateLastReadMessage(conversation_id, user_id);

      // Get updated conversation state
      const updatedConversation = await conversationService.getOneConversationById(
        conversation_id,
        user_id
      );

      // Emit update only if there was a change
      if (updatedConversation.last_read_message_id !== conversation.last_read_message_id) {
        io.to(`user_${user_id}`).emit("update_conversation", updatedConversation);
      }

      socket.data.conversation_id = conversation_id;
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });
};

export default registerConversationHandlers;
