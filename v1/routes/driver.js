const router = require("express").Router();
const controllers = require("../controllers");
const validations = require("../validations");
const service = require("../services");
/*
On-Boarding
*/
router.post("/signup", controllers.driver.signUp);
router.post("/login", controllers.driver.login);
router.post("/verify/email", validations.driver.isDriverValid, controllers.driver.verifyEmail);
router.post(
  "/verify/otp/:type",
  async (req, res, next) => {
    if (req.params.type != "forgot") validations.driver.isDriverValid(req, res, next);
    else next();
  },
  controllers.driver.verifyOtpUpdate
);
router.post(
  "/resend/otp/:type",
  async (req, res, next) => {
    if (req.params.type != "forgot") validations.driver.isDriverValid(req, res, next);
    else next();
  },
  controllers.driver.resendOtp
);
router.post("/forgot/password", controllers.driver.forgotPassword);
router.post("/reset/password", validations.driver.isDriverValid, controllers.driver.resetPassword);
router.post("/change/password", validations.driver.isDriverValid, controllers.driver.changePassword);
router.post("/complete/profile", validations.driver.isDriverValid, service.upload.DriverProfilePicUpload.single("profilePic"), controllers.driver.completeProfile);
router.post("/upload/documents", validations.driver.isDriverValid, service.upload.DriverDocumentsUpload.array("documents", 3), controllers.driver.uploadDocuments);
router.post("/logout", validations.driver.isDriverValid, controllers.driver.logout);
/*
CRUDs
*/
router.get("/profile", validations.driver.isDriverValid, controllers.driver.getProfile);
router.put("/profile", validations.driver.isDriverValid, service.upload.DriverProfilePicUpload.single("profilePic"), controllers.driver.editProfile);
/*
DropDowns
*/
router.get("/dropdowns/:type", validations.driver.isDriverValid, controllers.driver.dropDowns);
/*
Bookings
*/
router.get("/booking/:type", validations.driver.isDriverValid, controllers.driver.getBooking);
router.put("/booking/:type", validations.driver.isDriverValid, controllers.driver.updateBooking);
/*
Contact Us
*/
router.post("/contact/", validations.driver.isDriverValid, controllers.driver.contactUs);
/*
Notifications
*/
router.get("/notifications", validations.driver.isDriverValid, controllers.driver.getNotificationsWithPagination);
router.get("/records", validations.driver.isDriverValid, controllers.driver.getNotificationsWithPagination);
module.exports = router;
