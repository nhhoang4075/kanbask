import conversationService from "../api/services/conversation-service.js";

const registerConversationHandlers = (io, socket) => {
  socket.on("join_conversation", async ({ conversation_id, user_id }) => {
    try {
      const oldRoomId = socket.data?.conversation_room?.conversation_id;

      if (!oldRoomId) {
        socket.join(`conversation_${conversation_id}`);
        // console.log(`User ${user_id} joined conversation_${conversation_id}`);
      }

      if (oldRoomId && oldRoomId !== conversation_id) {
        socket.leave(`conversation_${oldRoomId}`);
        // console.log(`User ${user_id} leave conversation_${oldRoomId}`);

        socket.join(`conversation_${conversation_id}`);
        // console.log(`User ${user_id} joined conversation_${conversation_id}`);
      }

      socket.data.conversation_room = { conversation_id, user_id };

      await conversationService.updateLastReadMessage(conversation_id, user_id);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });
};

export default registerConversationHandlers;
