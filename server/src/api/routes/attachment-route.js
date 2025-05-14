import attachmentController from "../controllers/attachment-controller.js";
import attachmentValidation from "../validations/attachment-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";
import uploadMiddleware from "../../middlewares/upload-middleware.js";

const attachmentRoute = (router) => {
  router.get(
    "/attachments/:attachmentId/download",
    authMiddleware.authenticate,
    attachmentValidation.validateAttachmentIdParam,
    attachmentController.downloadAttachment
  );

  router.delete(
    "/attachments/:attachmentId",
    authMiddleware.authenticate,
    attachmentValidation.validateAttachmentIdParam,
    attachmentController.deleteSystemAttachment
  );

  router.post(
    "/tasks/:taskId/attachments",
    authMiddleware.authenticate,
    attachmentValidation.validateParentIdParam("taskId"),
    uploadMiddleware.uploadAttachment.single('attachmentFile'),
    attachmentController.UploadToTask
  );

  router.get(
    "/tasks/:taskId/attachments",
    authMiddleware.authenticate,
    attachmentValidation.validateParentIdParam("taskId"),
    attachmentController.getTaskAttachments
  );

  router.post(
    "/messages/:messageId/attachments",
    authMiddleware.authenticate,
    attachmentValidation.validateParentIdParam("messageId"),
    uploadMiddleware.uploadAttachment.single('attachmentFile'),
    attachmentController.UploadToMessage
  );

  router.get(
    "/messages/:messageId/attachments",
    authMiddleware.authenticate,
    attachmentValidation.validateParentIdParam("messageId"),
    attachmentController.getMessageAttachments
  );
};

export default attachmentRoute;
