import conversationService from "../api/services/conversation-service.js";
import messageService from "../api/services/message-service.js";

const registerMessageHandlers = (io, socket) => {
  socket.on("send_message", async ({ conversation_id, content }) => {
    try {
      const { id: sender_id } = socket.data.user;

      const message = await messageService.createOneMessage({
        conversation_id,
        sender_id,
        content
      });

      io.to(`conversation_${conversation_id}`).emit("new_message", message);

      const roomSockets = await io.in(`conversation_${conversation_id}`).fetchSockets();

      await Promise.all(
        roomSockets.map(async (sock) => {
          const {
            user: { id: user_id },
            conversation_id: current_conversation_id
          } = sock.data;
          if (user_id && current_conversation_id === conversation_id) {
            await conversationService.updateLastReadMessage(conversation_id, user_id);
          }
        })
      );

      const participants = await conversationService.getParticipantsOfConversation(conversation_id);

      await Promise.all(
        participants.map(async (p) => {
          const conversation = await conversationService.getOneConversationById(
            conversation_id,
            p.user_id
          );

          io.to(`user_${p.user_id}`).emit("update_conversation", conversation);
        })
      );
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("edit_message", async ({ message_id, content }) => {
    try {
      const message = await messageService.updateOneMessageById(message_id, { content });
      const { conversation_id } = message;

      io.to(`conversation_${conversation_id}`).emit("message_edited", message);

      const participants = await conversationService.getParticipantsOfConversation(conversation_id);

      await Promise.all(
        participants.map(async (p) => {
          const conversation = await conversationService.getOneConversationById(
            conversation_id,
            p.user_id
          );

          io.to(`user_${p.user_id}`).emit("update_conversation", conversation);
        })
      );
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });
};

export default registerMessageHandlers;
