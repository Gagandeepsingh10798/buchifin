const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const service = require('../services');
/*
On-Boarding
*/
router.post("/signup", service.upload.AdminProfilePicUpload.single('profilePic'), controllers.admin.signUp);
router.post("/login", controllers.admin.login);
router.post("/logout", validations.admin.isAdminValid, controllers.admin.logout);
/*
CRUD 
*/
router.get("/profile", validations.admin.isAdminValid, controllers.admin.getProfile);
router.put("/profile", validations.admin.isAdminValid, service.upload.AdminProfilePicUpload.single('profilePic'), controllers.admin.updateProfile);
router.put("/profile/password/change", validations.admin.isAdminValid, controllers.admin.changePassword);
router.post("/profile/password/forgot", controllers.admin.forgotPassword);
router.post("/profile/password/reset", controllers.admin.resetPassword);
/*
Manage Apps
*/
router.post("/app", validations.admin.isAdminValid, service.upload.AppIconUpload.single('icon'), controllers.admin.createApp);
router.get("/app", validations.admin.isAdminValid, controllers.admin.getApps);
router.get("/app/:id", validations.admin.isAdminValid, controllers.admin.getApp);
router.put("/app/:id", validations.admin.isAdminValid, service.upload.AppIconUpload.single('icon'), controllers.admin.updateApp);
/*
Manage News
*/
router.post("/news", validations.admin.isAdminValid, service.upload.NewsIconUpload.single('icon'), controllers.admin.createNews);
router.get("/news", validations.admin.isAdminValid, controllers.admin.getNews);
/*
Manage Users
*/
router.post("/user", validations.admin.isAdminValid, service.upload.CustomerProfilePicUpload.single('profilePic'), controllers.admin.createUser);
router.get("/user", validations.admin.isAdminValid, controllers.admin.getUsers);
/*
Manage Users Apps
*/
router.post("/user/app", validations.admin.isAdminValid, controllers.admin.linkApp);
router.get("/user/:id/app/", validations.admin.isAdminValid, controllers.admin.getUserApps);
router.get("/user/app/:id", validations.admin.isAdminValid, controllers.admin.getUserAppById);
module.exports = router;