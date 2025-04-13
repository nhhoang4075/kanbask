import projectController from "../controllers/project-controller.js"


const projectRoute = (router) => {
    router
        .route("/projects")
        .post(projectController.createProject);

    router  
        .route("/projects/:projectId/members/:userId")
        .post(projectController.addUserToProject)
        .delete(projectController.deleteUserFromProject)
        .put(projectController.updateUserProjectRole)

}

export default projectRoute;