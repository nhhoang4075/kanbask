import conversationService from "../api/services/conversation-service.js";

const registerConversationHandlers = (io, socket) => {
  socket.on("join_conversation", async ({ conversation_id }) => {
    try {
      const oldRoomId = socket.data?.conversation_id;
      const { id: user_id } = socket.data.user;

      if (!oldRoomId) {
        socket.join(`conversation_${conversation_id}`);
      }

      if (oldRoomId && oldRoomId !== conversation_id) {
        socket.leave(`conversation_${oldRoomId}`);
        socket.join(`conversation_${conversation_id}`);

        const conversationId = await conversationService.updateLastReadMessage(oldRoomId, user_id);
        const conversation = await conversationService.getOneConversationById(
          conversationId,
          user_id
        );

        io.to(`user_${user_id}`).emit("update_conversation", conversation);
      }

      socket.data.conversation_id = conversation_id;
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });
};

export default registerConversationHandlers;
