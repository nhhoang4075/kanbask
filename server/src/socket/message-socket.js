import conversationService from "../api/services/conversation-service.js";
import messageService from "../api/services/message-service.js";

const registerMessageHandlers = (io, socket) => {
  socket.on("send_message", async ({ conversation_id, content }) => {
    try {
      const { id: sender_id } = socket.data.user;

      // Check if this is the first message in a pending conversation
      const messages = await messageService.getManyMessagesByConversationId(
        conversation_id,
        sender_id
      );

      if (!messages.length) {
        await conversationService.updateConversationPendingStatus(conversation_id, sender_id);
      }

      const message = await messageService.createOneMessage({
        conversation_id,
        sender_id,
        content
      });

      // Emit new message to all users in the conversation
      io.to(`conversation_${conversation_id}`).emit("new_message", message);

      // Get all sockets in the conversation room
      const roomSockets = await io.in(`conversation_${conversation_id}`).fetchSockets();

      // Update last_read_message_id for all users currently in the conversation
      await Promise.all(
        roomSockets.map(async (sock) => {
          const {
            user: { id: user_id },
            conversation_id: current_conversation_id
          } = sock.data;

          // Only update if user is actively in this conversation
          if (user_id && current_conversation_id === conversation_id) {
            await conversationService.updateLastReadMessage(conversation_id, user_id);
          }
        })
      );

      // Get participants and send updated conversation state
      const participants = await conversationService.getParticipantsOfConversation(
        conversation_id,
        sender_id
      );

      await Promise.all(
        participants.map(async (p) => {
          const conversation = await conversationService.getOneConversationById(
            conversation_id,
            p.id
          );

          io.to(`user_${p.id}`).emit("update_conversation", conversation);
        })
      );
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("edit_message", async ({ message_id, content }) => {
    try {
      const { id: actor_id } = socket.data.user;

      const message = await messageService.updateOneMessageById(message_id, { content }, actor_id);
      const { conversation_id } = message;

      io.to(`conversation_${conversation_id}`).emit("message_edited", message);

      const participants = await conversationService.getParticipantsOfConversation(
        conversation_id,
        actor_id
      );

      await Promise.all(
        participants.map(async (p) => {
          const conversation = await conversationService.getOneConversationById(
            conversation_id,
            p.id
          );

          io.to(`user_${p.id}`).emit("update_conversation", conversation);
        })
      );
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });
};

export default registerMessageHandlers;
