import taskCommentService from "../api/services/task-comment-service.js";

const registerTaskCommentHandlers = (io, socket) => {
  socket.on("send_task_comment", async ({ task_id, content }) => {
    try {
      const { id: user_id } = socket.data.user;

      const comment = await taskCommentService.createOneComment({
        task_id,
        user_id,
        content
      });

      io.to(`task_${task_id}`).emit("new_task_comment", comment);
    } catch (error) {
      console.error("Error in send_task_comment:", error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("edit_task_comment", async ({ id, content }) => {
    try {
      const { id: user_id } = socket.data.user;

      const updatedComment = await taskCommentService.updateOneComment(id, user_id, content);
      const { task_id } = updatedComment;

      io.to(`task_${task_id}`).emit("edited_task_comment", updatedComment);
    } catch (error) {
      console.error("Error in edit_task_comment:", error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("delete_task_comment", async ({ id, task_id }) => {
    try {
      const { id: user_id } = socket.data.user;

      await taskCommentService.deleteOneComment(id, user_id);

      io.to(`task_${task_id}`).emit("deleted_task_comment", { id });
    } catch (error) {
      console.error("Error in delete_task_comment:", error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("join_task_room", ({ task_id }) => {
    socket.join(`task_${task_id}`);
  });

  socket.on("leave_task_room", ({ task_id }) => {
    socket.leave(`task_${task_id}`);
  });
};

export default registerTaskCommentHandlers;
