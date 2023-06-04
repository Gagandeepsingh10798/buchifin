const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const service = require('../services');
/*
On-Boarding
*/
router.post("/signup", service.upload.ImageUpload.single('profilePic'), controllers.admin.signUp);
router.post("/login", controllers.admin.login);
router.post("/logout", validations.admin.isAdminValid, controllers.admin.logout);
/*
CRUD 
*/
router.get("/profile", validations.admin.isAdminValid, controllers.admin.getProfile);
router.put("/profile", validations.admin.isAdminValid, service.upload.ImageUpload.single('profilePic'), controllers.admin.updateProfile);
router.put("/profile/password/change", validations.admin.isAdminValid, controllers.admin.changePassword);
router.post("/password/forgot", controllers.admin.forgotPassword);
router.post("/password/reset", controllers.admin.resetPassword);
/*
Image Upload
*/
router.post("/image/upload", service.upload.ImageUpload.single('image'), (req,res,next)=>{
    return res.status(200).send({
        filename: req.file.filename
    })
});
router.post("/file/upload", service.upload.FileUpload.single('file'),(req,res,next)=>{
    return res.status(200).send({
        filename: req.file.filename
    })
});
/*
Retailers CRUDs
*/
router.post("/retailer/signup", validations.admin.isAdminValid,controllers.admin.retailer.signUp);
module.exports = router;