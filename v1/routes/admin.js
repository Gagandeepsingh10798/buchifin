const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations')
const service = require('../services')
/*
On-Boarding
*/
router.post("/signup", service.upload.AdminProfilePicUpload.single('profilePic'), controllers.admin.signUp);
router.post("/login", controllers.admin.login);
router.post("/logout", validations.admin.isAdminValid, controllers.admin.logout);
/*
CRUD
*/
router.get("/profile", validations.admin.isAdminValid, controllers.admin.profile);
router.put("/profile", validations.admin.isAdminValid, service.upload.AdminProfilePicUpload.single('profilePic'), controllers.admin.updateProfile);
router.put("/profile/password", validations.admin.isAdminValid, controllers.admin.changePassword);
router.post("/profile/forget", controllers.admin.forgotPassword)
router.put("/profile/verify", controllers.admin.verifyAndUpdatePassword)
/*
Manage Apps
*/
router.post("/app", validations.admin.isAdminValid, service.upload.AppCategoryIconUpload.single('icon'), controllers.appCategory.create);
router.get("/app", validations.admin.isAdminValid, controllers.appCategory.get);
router.get("/app/:id", validations.admin.isAdminValid, controllers.appCategory.getById);
/*
Manage User Requests
*/
router.get("/request", controllers.admin.getRequest);
router.get("/request", controllers.admin.getRequestById);
router.put("/request/:id", controllers.admin.updateRequest);
/*
Manage Users
*/
module.exports = router