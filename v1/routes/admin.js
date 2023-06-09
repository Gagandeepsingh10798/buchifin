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
router.post("/password/forgot", controllers.admin.forgotPassword);
router.post("/password/reset", controllers.admin.resetPassword);

module.exports = router;