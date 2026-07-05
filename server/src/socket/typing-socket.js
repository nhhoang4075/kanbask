const registerTypingHandlers = (io, socket) => {
  socket.on("typing", ({ conversation_id }) => {
    const { id: user_id } = socket.data.user;

    socket.to(`conversation_${conversation_id}`).emit("user_typing", { conversation_id, user_id });
  });

  socket.on("stop_typing", ({ conversation_id }) => {
    const { id: user_id } = socket.data.user;

    socket
      .to(`conversation_${conversation_id}`)
      .emit("user_stopped_typing", { conversation_id, user_id });
  });
};

export default registerTypingHandlers;
