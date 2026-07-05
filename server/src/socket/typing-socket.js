import conversationService from "../api/services/conversation-service.js";

// Broadcast to each participant's personal room (not the conversation room)
// so typing status reaches every device a participant is connected from,
// including ones that don't currently have this conversation open (e.g. the
// conversation list). getParticipantsOfConversation also verifies the actor
// is actually a member of conversation_id, rejecting spoofed ids.
const registerTypingHandlers = (io, socket) => {
  socket.on("typing", async ({ conversation_id }) => {
    try {
      const { id: user_id } = socket.data.user;
      const participants = await conversationService.getParticipantsOfConversation(
        conversation_id,
        user_id
      );

      participants.forEach((p) => {
        io.to(`user_${p.id}`).emit("user_typing", { conversation_id, user_id });
      });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("stop_typing", async ({ conversation_id }) => {
    try {
      const { id: user_id } = socket.data.user;
      const participants = await conversationService.getParticipantsOfConversation(
        conversation_id,
        user_id
      );

      participants.forEach((p) => {
        io.to(`user_${p.id}`).emit("user_stopped_typing", { conversation_id, user_id });
      });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });
};

export default registerTypingHandlers;
