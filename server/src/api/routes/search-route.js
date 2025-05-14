import searchController from "../controllers/search-controller.js";
import searchValidation from "../validations/search-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const searchRoute = (router) => {
  router.use("/search", authMiddleware.authenticate);

  router
    .route("/search/users")
    .get(searchValidation.validateSearchUsersQuery, searchController.searchUsers);

  router
    .route("/search/tasks")
    .get(searchValidation.validateSearchTasksQuery, searchController.searchTasks);

  router
    .route("/search/messages")
    .get(searchValidation.validateSearchMessagesQuery, searchController.searchMessages);
};

export default searchRoute;
