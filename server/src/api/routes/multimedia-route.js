import multimediaController from "../controllers/multimedia-controller.js";
import multimediaValidation from "../validations/multimedia-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";
import uploadMiddleware from "../../middlewares/upload-middleware.js";

const multimediaRoute = (router) => {
  router.use("/media", authMiddleware.authenticate);

  router
    .route("/media/files/:task_id")
    .post(uploadMiddleware.uploadAnyFile.single("fileUpload"), multimediaController.uploadFile);

  router
    .route("/media/images/:message_id")
    .post(uploadMiddleware.uploadImage.single("imageUpload"), multimediaController.uploadImage);

  router
    .route("/media/videos/:message_id")
    .post(uploadMiddleware.uploadVideo.single("videoUpload"), multimediaController.uploadVideo);

  router
    .route("/media/files/:id")
    .delete(multimediaValidation.validateIdParam, multimediaController.deleteFile);

  router
    .route("/media/assets/:id")
    .delete(multimediaValidation.validateIdParam, multimediaController.deleteMediaAsset);

  router
    .route("/media/files/:id")
    .get(multimediaValidation.validateIdParam, multimediaController.downloadFile);

  router
    .route("/media/assets/:id")
    .get(multimediaValidation.validateIdParam, multimediaController.downloadImageOrVideo);
};

export default multimediaRoute;
