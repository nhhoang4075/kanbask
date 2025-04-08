import messageService from "../api/services/message-service.js";

const registerMessageHandlers = (io, socket) => {
  socket.on("join_conversation", ({ conversation_id, user_id }) => {
    socket.join(`conversation_${conversation_id}`);
    console.log(`User ${user_id} joined conversation_${conversation_id}`);
  });

  socket.on("send_message", async ({ conversation_id, sender_id, content }) => {
    try {
      const message = await messageService.createOneMessage({
        conversation_id,
        sender_id,
        content
      });

      io.to(`conversation_${conversation_id}`).emit("new_message", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Error sending message" });
    }
  });
};

export default registerMessageHandlers;
