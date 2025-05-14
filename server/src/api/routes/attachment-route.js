import attachmentController from "../controllers/attachment-controller.js";
import attachmentValidation from "../validations/attachment-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";
import uploadMiddleware from "../../middlewares/upload-middleware.js";

const attachmentRoute = (router) => {
  router.post(
    "/attachments/upload",
    authMiddleware.authenticate,
    uploadMiddleware.uploadAttachment.single('attachmentFile'),
    attachmentController.uploadAttachment
  );

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
    attachmentValidation.validateLinkBody,
    attachmentController.linkToTask
  );

  router.get(
    "/tasks/:taskId/attachments",
    authMiddleware.authenticate,
    attachmentValidation.validateParentIdParam("taskId"),
    attachmentController.getTaskAttachments
  );

  router.delete(
    "/tasks/:taskId/attachments/:attachmentId",
    authMiddleware.authenticate,
    attachmentValidation.validateUnlinkParams("taskId"),
    attachmentController.unlinkFromTask
  );

  router.post(
    "/messages/:messageId/attachments",
    authMiddleware.authenticate,
    attachmentValidation.validateParentIdParam("messageId"),
    attachmentValidation.validateLinkBody,
    attachmentController.linkToMessage
  );

  router.get(
    "/messages/:messageId/attachments",
    authMiddleware.authenticate,
    attachmentValidation.validateParentIdParam("messageId"),
    attachmentController.getMessageAttachments
  );

  router.delete(
    "/messages/:messageId/attachments/:attachmentId",
    authMiddleware.authenticate,
    attachmentValidation.validateUnlinkParams("messageId"),
    attachmentController.unlinkFromMessage
  );
};

export default attachmentRoute;
