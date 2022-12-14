import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);

  //rest api
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/soft-delete-user", userController.handleSoftDeleteUser);
  router.delete("/api/force-delete-user", userController.handleForceDeleteUser);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.post("/api/restore-user", userController.handleRestoreUser);

  router.get("/api/allcode", userController.getAllCode);

  return app.use("/", router);
};

module.exports = initWebRoutes;
