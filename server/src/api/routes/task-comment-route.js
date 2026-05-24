import express from "express";
import taskCommentController from "../controllers/task-comment-controller.js";


const taskCommentRoute = (router) => {
router.post("/createcmt", taskCommentController.createOneComment);
router.get("/:taskId/getcmt", taskCommentController.getCommentsByTaskId);
router.put("/:id/updatecmt", taskCommentController.updateOneComment);
router.delete("/:id/deletecmt", taskCommentController.deleteOneComment);
}
export default taskCommentRoute;